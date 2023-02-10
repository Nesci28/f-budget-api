import {
  Renew,
  RenewCreate,
  RenewPatch,
  RenewPopulateField,
  RenewSearch,
  RenewUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { RenewDocument } from "./models/renew.model";
import { RenewErrors } from "./renew.errors";

export type RenewModels = {
  model: Renew;
  modelCreate: RenewCreate;
  modelUpdate: RenewUpdate;
  modelPatch: RenewPatch;
  modelSearch: RenewSearch;
  modelPopulate: Array<RenewPopulateField>;
  modelDocument: RenewDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class RenewRepository extends BaseRepository<RenewModels> {
  private logger = new Logger(RenewRepository.name);

  constructor(
    @InjectModel("MongoRenew", "f-budget")
    public readonly renewModel: Model<RenewDocument>,
  ) {
    super(renewModel, RenewErrors);
  }

  public async create(model: RenewCreate, isDryRun?: boolean): Promise<Renew> {
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
    modelBulk: RenewCreate[],
    isDryRun?: boolean,
  ): Promise<Renew[]> {
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
    searchParams: RenewSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Renew, never>> {
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
    populate?: RenewPopulateField[],
  ): Promise<Renew[]> {
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
    populate?: RenewPopulateField[],
  ): Promise<Renew> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: RenewPatch): Promise<Renew> {
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
    model: RenewUpdate,
    isDryRun?: boolean,
  ): Promise<Renew> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Renew> {
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
