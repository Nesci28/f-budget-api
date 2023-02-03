import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  EndpointCreate,
  ModuleCreate,
  Project,
  ProjectCreate,
  ProjectPatch,
  ProjectPopulateField,
  ProjectSearch,
  ProjectUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
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

    if (resolvedYamlStr) {
      const resolvedYaml = YAML.parse(resolvedYamlStr);

      const endpointCreates: EndpointCreate[] = Object.keys(
        resolvedYaml.paths,
      ).map((x) => {
        return {
          path: x,
        };
      });
      const endpoints = await this.endpointService.createMany(endpointCreates);

      const moduleNames: string[] = uniq(
        flatten(
          Object.keys(resolvedYaml.paths).map((x) => {
            const pathHttpMethods = resolvedYaml.paths[x];
            const tags = Object.keys(pathHttpMethods).map((p) => {
              const pathHttpMethod = pathHttpMethods[p];
              return pathHttpMethod.tags[0];
            });
            return tags;
          }),
        ),
      );
      const moduleCreates: ModuleCreate[] = moduleNames.map((x) => {
        const pathsFilteredByModule = Object.keys(resolvedYaml.paths).filter(
          (p) => {
            const [tag] = resolvedYaml.paths[p].tags;
            return tag === x;
          },
        );
        const endpointsFilteredByModule = endpoints.filter((e) => {
          return pathsFilteredByModule.includes(e.path);
        });
        const endpointIds = endpointsFilteredByModule.map((e) => {
          return e.id;
        });

        return {
          name: x,
          endpointIds,
        };
      });
      console.log("moduleCreates :>> ", moduleCreates);

      console.log("resolvedYaml :>> ", resolvedYaml);
    }

    const res = await this.projectRepository.create(project, isDryRun);
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

  private async setAllowedIps(): Promise<void> {
    const projects = await this.projectRepository.getAll();
    const allowedIps = uniq(
      flatten(
        projects.map((x) => {
          return x.serverIps;
        }),
      ).filter(Boolean),
    ) as string[];
    this.allowedIps = allowedIps;
  }
}
