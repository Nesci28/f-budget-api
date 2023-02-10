
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Envelop,
  EnvelopCreate,
  EnvelopPatch,EnvelopPopulateField,
  EnvelopSearch,
  EnvelopUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { BaseRepository, Projection, PropertyControlOptionRepository, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { EnvelopErrors } from "./envelop.errors";
import { EnvelopDocument } from "./models/envelop.model";

export type EnvelopModels = {
  model: Envelop;
  modelCreate: EnvelopCreate;
  modelUpdate: EnvelopUpdate;
  modelPatch: EnvelopPatch;
  modelSearch: EnvelopSearch;
  modelPopulate: Array<EnvelopPopulateField>;
  modelDocument: EnvelopDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class EnvelopRepository extends BaseRepository<EnvelopModels> {
  private logger = new Logger(EnvelopRepository.name);

  constructor(
    @InjectModel("MongoEnvelop", "f-budget")
    public readonly envelopModel: Model<EnvelopDocument>,
  ) {
    super(envelopModel, EnvelopErrors);
  }

  public async create(
    model: EnvelopCreate,
    isDryRun?: boolean,
  ): Promise<Envelop> {
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
    modelBulk: EnvelopCreate[],
    isDryRun?: boolean,
  ): Promise<Envelop[]> {
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
    searchParams: EnvelopSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Envelop>> {
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
    populate?: EnvelopPopulateField[],
  ): Promise<Envelop[]> {
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
    populate?: EnvelopPopulateField[],
  ): Promise<Envelop> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(
    modelId: string,
    model: EnvelopPatch,
  ): Promise<Envelop> {
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
    model: EnvelopUpdate,
    isDryRun?: boolean,
  ): Promise<Envelop> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Envelop> {
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
