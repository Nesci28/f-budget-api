import {
  Upload,
  UploadCreate,
  UploadPatch,
  UploadPopulateField,
  UploadSearch,
  UploadUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { UploadDocument } from "./models/upload.model";
import { UploadErrors } from "./upload.errors";

export type UploadModels = {
  model: Upload;
  modelCreate: UploadCreate;
  modelUpdate: UploadUpdate;
  modelPatch: UploadPatch;
  modelSearch: UploadSearch;
  modelPopulate: Array<UploadPopulateField>;
  modelDocument: UploadDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class UploadRepository extends BaseRepository<UploadModels> {
  private logger = new Logger(UploadRepository.name);

  constructor(
    @InjectModel("MongoUpload", "f-budget")
    public readonly uploadModel: Model<UploadDocument>,
  ) {
    super(uploadModel, UploadErrors);
  }

  public async create(
    model: UploadCreate,
    isDryRun?: boolean,
  ): Promise<Upload> {
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
    modelBulk: UploadCreate[],
    isDryRun?: boolean,
  ): Promise<Upload[]> {
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
    searchParams: UploadSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Upload, never>> {
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
    populate?: UploadPopulateField[],
  ): Promise<Upload[]> {
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
    populate?: UploadPopulateField[],
  ): Promise<Upload> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: UploadPatch): Promise<Upload> {
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
    model: UploadUpdate,
    isDryRun?: boolean,
  ): Promise<Upload> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Upload> {
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
