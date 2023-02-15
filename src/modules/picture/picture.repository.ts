import {
  Picture,
  PictureCreate,
  PicturePatch,
  PicturePopulateField,
  PictureSearch,
  PictureUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository, Projection, YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import { Model } from "mongoose";

import { PictureDocument } from "./models/picture.model";
import { PictureErrors } from "./picture.errors";

export type PictureModels = {
  model: Picture;
  modelCreate: PictureCreate;
  modelUpdate: PictureUpdate;
  modelPatch: PicturePatch;
  modelSearch: PictureSearch;
  modelPopulate: Array<PicturePopulateField>;
  modelDocument: PictureDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class PictureRepository extends BaseRepository<PictureModels> {
  private logger = new Logger(PictureRepository.name);

  constructor(
    @InjectModel("MongoPicture", "f-budget")
    public readonly pictureModel: Model<PictureDocument>,
  ) {
    super(pictureModel, PictureErrors);
  }

  public async create(
    model: PictureCreate,
    isDryRun?: boolean,
  ): Promise<Picture> {
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
    modelBulk: PictureCreate[],
    isDryRun?: boolean,
  ): Promise<Picture[]> {
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
    searchParams: PictureSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<Picture, never>> {
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
    populate?: PicturePopulateField[],
  ): Promise<Picture[]> {
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
    populate?: PicturePopulateField[],
  ): Promise<Picture> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: PicturePatch): Promise<Picture> {
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
    model: PictureUpdate,
    isDryRun?: boolean,
  ): Promise<Picture> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<Picture> {
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
