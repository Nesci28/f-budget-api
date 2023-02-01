import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Request,
  RequestCreate,
  RequestPatch,
  RequestPopulateField,
  RequestSearch,
  RequestUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { RequestDocument } from "./models/request.model";
import { RequestErrors } from "./request.errors";

export type RequestModels = {
  model: Request;
  modelCreate: RequestCreate;
  modelUpdate: RequestUpdate;
  modelPatch: RequestPatch;
  modelSearch: RequestSearch;
  modelPopulate: Array<RequestPopulateField>;
  modelDocument: RequestDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class RequestRepository extends BaseRepository<RequestModels> {
  private logger = new Logger(RequestRepository.name);

  constructor(
    @InjectModel("MongoRequest", configs.mongooseConnectionName)
    public readonly requestModel: Model<RequestDocument>,
  ) {
    super(requestModel, RequestErrors);
  }

  public async create(
    model: RequestCreate,
    isDryRun?: boolean,
  ): Promise<Request> {
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
    modelBulk: RequestCreate[],
    isDryRun?: boolean,
  ): Promise<Request[]> {
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
    searchParams: RequestSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Request, never>> {
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
    populate?: RequestPopulateField[],
  ): Promise<Request[]> {
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
    populate?: RequestPopulateField[],
  ): Promise<Request> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: RequestPatch): Promise<Request> {
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
    model: RequestUpdate,
    isDryRun?: boolean,
  ): Promise<Request> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Request> {
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
