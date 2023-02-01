import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Endpoint,
  EndpointCreate,
  EndpointPatch,
  EndpointSearch,
  EndpointUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { EndpointErrors } from "./endpoint.errors";
import { EndpointDocument } from "./models/endpoint.model";

export type EndpointModels = {
  model: Endpoint;
  modelCreate: EndpointCreate;
  modelUpdate: EndpointUpdate;
  modelPatch: EndpointPatch;
  modelSearch: EndpointSearch;
  modelPopulate: Array<never>;
  modelDocument: EndpointDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class EndpointRepository extends BaseRepository<EndpointModels> {
  private logger = new Logger(EndpointRepository.name);

  constructor(
    @InjectModel("MongoEndpoint", configs.mongooseConnectionName)
    public readonly endpointModel: Model<EndpointDocument>,
  ) {
    super(endpointModel, EndpointErrors);
  }

  public async create(
    model: EndpointCreate,
    isDryRun?: boolean,
  ): Promise<Endpoint> {
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
    modelBulk: EndpointCreate[],
    isDryRun?: boolean,
  ): Promise<Endpoint[]> {
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
    searchParams: EndpointSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Endpoint, never>> {
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
    populate?: never[],
  ): Promise<Endpoint[]> {
    try {
      const res = await super.getAll(isArchived, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async getById(modelId: string, populate?: never[]): Promise<Endpoint> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: EndpointPatch): Promise<Endpoint> {
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
    model: EndpointUpdate,
    isDryRun?: boolean,
  ): Promise<Endpoint> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Endpoint> {
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
