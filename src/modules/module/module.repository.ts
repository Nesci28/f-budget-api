import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Module,
  ModuleCreate,
  ModulePatch,
  ModulePopulateField,
  ModuleSearch,
  ModuleUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { ModuleDocument } from "./models/module.model";
import { ModuleErrors } from "./module.errors";

export type ModuleModels = {
  model: Module;
  modelCreate: ModuleCreate;
  modelUpdate: ModuleUpdate;
  modelPatch: ModulePatch;
  modelSearch: ModuleSearch;
  modelPopulate: Array<ModulePopulateField>;
  modelDocument: ModuleDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class ModuleRepository extends BaseRepository<ModuleModels> {
  private logger = new Logger(ModuleRepository.name);

  constructor(
    @InjectModel("MongoModule", configs.mongooseConnectionName)
    public readonly moduleModel: Model<ModuleDocument>,
  ) {
    super(moduleModel, ModuleErrors);
  }

  public async create(
    model: ModuleCreate,
    isDryRun?: boolean,
  ): Promise<Module> {
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
    modelBulk: ModuleCreate[],
    isDryRun?: boolean,
  ): Promise<Module[]> {
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
    searchParams: ModuleSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Module, never>> {
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
    populate?: ModulePopulateField[],
  ): Promise<Module[]> {
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
    populate?: ModulePopulateField[],
  ): Promise<Module> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: ModulePatch): Promise<Module> {
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
    model: ModuleUpdate,
    isDryRun?: boolean,
  ): Promise<Module> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Module> {
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
