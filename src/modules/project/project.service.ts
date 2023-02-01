import { Injectable } from "@nestjs/common";
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

import { ProjectErrors } from "./project.errors";
import { ProjectRepository } from "./project.repository";

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  public async create(
    project: ProjectCreate,
    isDryRun?: boolean,
  ): Promise<Project> {
    const res = await this.projectRepository.create(project, isDryRun);
    return res;
  }

  public async createMany(projectBulk: ProjectCreate[]): Promise<Project[]> {
    const res = await this.projectRepository.createMany(projectBulk);
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
    return res;
  }

  public async archive(projectId: string): Promise<Project> {
    await this.checkIfAlreadyArchived(projectId);
    const res = await this.projectRepository.archive(projectId);
    return res;
  }

  private async checkIfAlreadyArchived(projectId: string): Promise<Project> {
    const project = await this.getById(projectId);
    if (project.archived) {
      throw new ResultHandlerException(ProjectErrors.alreadyArchived);
    }

    return project;
  }
}
