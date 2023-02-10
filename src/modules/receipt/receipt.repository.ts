import {
  Receipt,
  ReceiptCreate,
  ReceiptPatch,
  ReceiptPopulateField,
  ReceiptSearch,
  ReceiptUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { ReceiptDocument } from "./models/receipt.model";
import { ReceiptErrors } from "./receipt.errors";

export type ReceiptModels = {
  model: Receipt;
  modelCreate: ReceiptCreate;
  modelUpdate: ReceiptUpdate;
  modelPatch: ReceiptPatch;
  modelSearch: ReceiptSearch;
  modelPopulate: Array<ReceiptPopulateField>;
  modelDocument: ReceiptDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class ReceiptRepository extends BaseRepository<ReceiptModels> {
  private logger = new Logger(ReceiptRepository.name);

  constructor(
    @InjectModel("MongoReceipt", "f-budget")
    public readonly receiptModel: Model<ReceiptDocument>,
  ) {
    super(receiptModel, ReceiptErrors);
  }

  public async create(
    model: ReceiptCreate,
    isDryRun?: boolean,
  ): Promise<Receipt> {
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
    modelBulk: ReceiptCreate[],
    isDryRun?: boolean,
  ): Promise<Receipt[]> {
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
    searchParams: ReceiptSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Receipt, never>> {
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
    populate?: ReceiptPopulateField[],
  ): Promise<Receipt[]> {
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
    populate?: ReceiptPopulateField[],
  ): Promise<Receipt> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: ReceiptPatch): Promise<Receipt> {
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
    model: ReceiptUpdate,
    isDryRun?: boolean,
  ): Promise<Receipt> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Receipt> {
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
