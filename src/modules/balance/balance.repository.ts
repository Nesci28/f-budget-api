import {
  Balance,
  BalanceCreate,
  BalancePatch,
  BalancePopulateField,
  BalanceSearch,
  BalanceUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { BalanceErrors } from "./balance.errors";
import { BalanceDocument } from "./models/balance.model";

export type BalanceModels = {
  model: Balance;
  modelCreate: BalanceCreate;
  modelUpdate: BalanceUpdate;
  modelPatch: BalancePatch;
  modelSearch: BalanceSearch;
  modelPopulate: Array<BalancePopulateField>;
  modelDocument: BalanceDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class BalanceRepository extends BaseRepository<BalanceModels> {
  private logger = new Logger(BalanceRepository.name);

  constructor(
    @InjectModel("MongoBalance", "f-budget")
    public readonly balanceModel: Model<BalanceDocument>,
  ) {
    super(balanceModel, BalanceErrors);
  }

  public async create(
    model: BalanceCreate,
    isDryRun?: boolean,
  ): Promise<Balance> {
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
    modelBulk: BalanceCreate[],
    isDryRun?: boolean,
  ): Promise<Balance[]> {
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
    searchParams: BalanceSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Balance, never>> {
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
    populate?: BalancePopulateField[],
  ): Promise<Balance[]> {
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
    populate?: BalancePopulateField[],
  ): Promise<Balance> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: BalancePatch): Promise<Balance> {
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
    model: BalanceUpdate,
    isDryRun?: boolean,
  ): Promise<Balance> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Balance> {
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
