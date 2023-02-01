import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Project,
  ProjectCreate,
  ProjectPatch,
  ProjectPopulateField,
  ProjectSearch,
  ProjectUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { ProjectDocument } from "./models/project.model";
import { ProjectErrors } from "./project.errors";

export type ProjectModels = {
  model: Project;
  modelCreate: ProjectCreate;
  modelUpdate: ProjectUpdate;
  modelPatch: ProjectPatch;
  modelSearch: ProjectSearch;
  modelPopulate: Array<ProjectPopulateField>;
  modelDocument: ProjectDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectModels> {
  private logger = new Logger(ProjectRepository.name);

  constructor(
    @InjectModel("MongoProject", configs.mongooseConnectionName)
    public readonly projectModel: Model<ProjectDocument>,
  ) {
    super(projectModel, ProjectErrors);
  }

  public async create(
    model: ProjectCreate,
    isDryRun?: boolean,
  ): Promise<Project> {
    try {
      const res = await super.create(model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async createMany(
    modelBulk: ProjectCreate[],
    isDryRun?: boolean,
  ): Promise<Project[]> {
    try {
      const res = await super.createMany(modelBulk, isDryRun);
      return res;
    } catch (err) {
      this.logger.error(err.message);
      const errorParsed = JSON.parse(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async search(
    searchParams: ProjectSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Project, never>> {
    try {
      const res = await super.search(searchParams, projection);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async getAll(
    isArchived?: boolean,
    populate?: ProjectPopulateField[],
  ): Promise<Project[]> {
    try {
      const res = await super.getAll(isArchived, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async getById(
    modelId: string,
    populate?: ProjectPopulateField[],
  ): Promise<Project> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: ProjectPatch): Promise<Project> {
    try {
      const res = await super.patch(modelId, model);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async update(
    modelId: string,
    model: ProjectUpdate,
    isDryRun?: boolean,
  ): Promise<Project> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Project> {
    try {
      const res = await super.archive(modelId);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }
}
