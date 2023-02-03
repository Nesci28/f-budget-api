import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Endpoint,
  EndpointCreate,
  HttpMethod,
  Module,
  ModuleCreate,
  Project,
  ProjectCreate,
  ProjectPatch,
  ProjectPopulateField,
  ProjectSearch,
  ProjectUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { flatten as flat } from "flat";
import { flatten, uniq } from "lodash";
import * as YAML from "yamljs";

import { EndpointService } from "../endpoint/endpoint.service";
import { ModuleService } from "../module/module.service";
import { ProjectErrors } from "./project.errors";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  public allowedIps: string[] = [];

  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly endpointService: EndpointService,
    private readonly moduleService: ModuleService,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    this.allowedIps.push("::ffff:127.0.0.1", "127.0.0.1");
    await this.setAllowedIps();
  }

  public async create(
    project: ProjectCreate,
    isDryRun?: boolean,
    resolvedYamlStr?: string,
    logoBase64?: string,
  ): Promise<Project> {
    if (logoBase64) {
      // eslint-disable-next-line no-param-reassign
      project.logo = logoBase64;
    }

    const res = await this.projectRepository.create(project, isDryRun);

    if (resolvedYamlStr) {
      const resolvedYaml = YAML.parse(resolvedYamlStr);
      const pathFlatten = flat(resolvedYaml.paths);
      const paths = Object.keys(pathFlatten)
        .filter((x) => {
          const isTagPath = x.endsWith(".tags.0");
          return isTagPath;
        })
        .reduce<Record<string, string>>((accu, curr) => {
          const path = pathFlatten[curr];
          // eslint-disable-next-line no-param-reassign
          accu[curr] = path;
          return accu;
        }, {});

      // Creates all the Endpoints
      const endpoints = await this.createEndpoints(paths, res.id);

      // Creates all the Modules
      const modules = await this.createModules(paths, endpoints, res.id);
      const moduleIds = modules.map((x) => {
        return x.id;
      });
      // eslint-disable-next-line no-param-reassign
      project.moduleIds = moduleIds;
    }

    await this.setAllowedIps();
    return res;
  }

  public async createMany(projectBulk: ProjectCreate[]): Promise<Project[]> {
    const res = await this.projectRepository.createMany(projectBulk);
    await this.setAllowedIps();
    return res;
  }

  public async search(
    searchParams: ProjectSearch,
  ): Promise<YestPaginateResult<Project, never>> {
    const res = await this.projectRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: ProjectPopulateField[],
  ): Promise<Project[]> {
    const res = await this.projectRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    projectId: string,
    populate?: ProjectPopulateField[],
  ): Promise<Project> {
    const res = await this.projectRepository.getById(projectId, populate);
    return res;
  }

  public async patch(
    projectId: string,
    project: ProjectPatch,
  ): Promise<Project> {
    await this.checkIfAlreadyArchived(projectId);
    const res = await this.projectRepository.patch(projectId, project);
    await this.setAllowedIps();
    return res;
  }

  public async update(
    projectId: string,
    project: ProjectUpdate,
    isDryRun?: boolean,
  ): Promise<Project> {
    await this.checkIfAlreadyArchived(projectId);
    const res = await this.projectRepository.update(
      projectId,
      project,
      isDryRun,
    );
    await this.setAllowedIps();
    return res;
  }

  public async archive(projectId: string): Promise<Project> {
    await this.checkIfAlreadyArchived(projectId);
    const res = await this.projectRepository.archive(projectId);
    await this.setAllowedIps();
    return res;
  }

  private async checkIfAlreadyArchived(projectId: string): Promise<Project> {
    const project = await this.getById(projectId);
    if (project.archived) {
      throw new ResultHandlerException(ProjectErrors.alreadyArchived);
    }

    return project;
  }

  private async createModules(
    paths: Record<string, string>,
    endpoints: Endpoint[],
    projectId: string,
  ): Promise<Module[]> {
    // Get the Module Names
    const moduleNames: string[] = uniq(Object.values(paths));

    // Create all the Modules
    const moduleCreates: ModuleCreate[] = [];
    for (let i = 0; i < moduleNames.length; i += 1) {
      const moduleName = moduleNames[i];
      const pathEntries = Object.entries(paths);
      const pathEntriesFiltered = pathEntries.filter((x) => {
        const isSameModule = x[1] === moduleName;
        return isSameModule;
      });

      const endpointIds: string[] = [];
      for (let j = 0; j < pathEntriesFiltered.length; j += 1) {
        const [pathEntryFiltered] = pathEntriesFiltered[j];
        const [path, httpMethod] = pathEntryFiltered.split(".");
        const httpMethodTransformed = this.transformHttpMethod(httpMethod);
        const endpoint = endpoints.find((x) => {
          return x.path === path && x.httpMethod === httpMethodTransformed;
        });
        if (!endpoint) {
          throw new Error("Endpoint should exists");
        }
        const { id: endpointId } = endpoint;
        endpointIds.push(endpointId);
      }
      const moduleCreate: ModuleCreate = {
        name: moduleName,
        endpointIds,
        projectId,
      };
      moduleCreates.push(moduleCreate);
    }

    const modules = await this.moduleService.createMany(moduleCreates);
    return modules;
  }

  private async createEndpoints(
    paths: Record<string, string>,
    projectId: string,
  ): Promise<Endpoint[]> {
    const endpointCreates: EndpointCreate[] = Object.keys(paths).map((x) => {
      const [path, httpMethod] = x.split(".");
      return {
        path,
        httpMethod: this.transformHttpMethod(httpMethod),
        projectId,
      };
    });
    const endpoints = await this.endpointService.createMany(endpointCreates);

    return endpoints;
  }

  private async setAllowedIps(): Promise<void> {
    const projects = await this.projectRepository.getAll();
    const allowedIps = uniq(
      flatten(
        projects.map((x) => {
          return x.serverIps;
        }),
      ).filter(Boolean),
    ) as string[];
    this.allowedIps = ["::ffff:127.0.0.1", "127.0.0.1", ...allowedIps];
  }

  private transformHttpMethod(httpMethod: string): HttpMethod {
    switch (httpMethod) {
      case "get":
        return HttpMethod.Get;
      case "post":
        return HttpMethod.Post;
      case "put":
        return HttpMethod.Put;
      case "patch":
        return HttpMethod.Patch;
      case "delete":
        return HttpMethod.Delete;
      default:
        throw new Error("Missing HttpMethod");
    }
  }
}
