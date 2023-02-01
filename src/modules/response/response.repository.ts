import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Response,
  ResponseCreate,
  ResponsePatch,
  ResponsePopulateField,
  ResponseSearch,
  ResponseUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { ResponseDocument } from "./models/response.model";
import { ResponseErrors } from "./response.errors";

export type ResponseModels = {
  model: Response;
  modelCreate: ResponseCreate;
  modelUpdate: ResponseUpdate;
  modelPatch: ResponsePatch;
  modelSearch: ResponseSearch;
  modelPopulate: Array<ResponsePopulateField>;
  modelDocument: ResponseDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class ResponseRepository extends BaseRepository<ResponseModels> {
  private logger = new Logger(ResponseRepository.name);

  constructor(
    @InjectModel("MongoResponse", configs.mongooseConnectionName)
    public readonly responseModel: Model<ResponseDocument>,
  ) {
    super(responseModel, ResponseErrors);
  }

  public async create(
    model: ResponseCreate,
    isDryRun?: boolean,
  ): Promise<Response> {
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
    modelBulk: ResponseCreate[],
    isDryRun?: boolean,
  ): Promise<Response[]> {
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
    searchParams: ResponseSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Response, never>> {
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
    populate?: ResponsePopulateField[],
  ): Promise<Response[]> {
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
    populate?: ResponsePopulateField[],
  ): Promise<Response> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: ResponsePatch): Promise<Response> {
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
    model: ResponseUpdate,
    isDryRun?: boolean,
  ): Promise<Response> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Response> {
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
