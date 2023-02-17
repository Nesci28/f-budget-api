import {
  Payment,
  PaymentCreate,
  PaymentPatch,
  PaymentPopulateField,
  PaymentSearch,
  PaymentUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { PaymentDocument } from "./models/payment.model";
import { PaymentErrors } from "./payment.errors";

export type PaymentModels = {
  model: Payment;
  modelCreate: PaymentCreate;
  modelUpdate: PaymentUpdate;
  modelPatch: PaymentPatch;
  modelSearch: PaymentSearch;
  modelPopulate: Array<PaymentPopulateField>;
  modelDocument: PaymentDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class PaymentRepository extends BaseRepository<PaymentModels> {
  private logger = new Logger(PaymentRepository.name);

  constructor(
    @InjectModel("MongoPayment", "f-budget")
    public readonly paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel, PaymentErrors);
  }

  public async create(
    model: PaymentCreate,
    isDryRun?: boolean,
  ): Promise<Payment> {
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
    modelBulk: PaymentCreate[],
    isDryRun?: boolean,
  ): Promise<Payment[]> {
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
    searchParams: PaymentSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Payment, never>> {
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
    populate?: PaymentPopulateField[],
  ): Promise<Payment[]> {
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
    populate?: PaymentPopulateField[],
  ): Promise<Payment> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: PaymentPatch): Promise<Payment> {
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
    model: PaymentUpdate,
    isDryRun?: boolean,
  ): Promise<Payment> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Payment> {
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
