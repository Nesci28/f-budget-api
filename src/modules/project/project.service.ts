import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Project,
  ProjectCreate,
  ProjectPatch,
  ProjectPopulateField,
  ProjectSearch,
  ProjectUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { flatten, uniq } from "lodash";

import { AppModule } from "../../app.module";
import { ProjectErrors } from "./project.errors";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService implements OnApplicationBootstrap {
  public allowedIps: string[] = [];

  constructor(private readonly projectRepository: ProjectRepository) {}

  public async onApplicationBootstrap(): Promise<void> {
    const testMode = Reflect.getMetadata("testMode", AppModule);
    if (testMode) {
      this.allowedIps.push("::ffff:127.0.0.1");
      return;
    }

    await this.setAllowedIps();
  }

  public async create(
    project: ProjectCreate,
    isDryRun?: boolean,
  ): Promise<Project> {
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
