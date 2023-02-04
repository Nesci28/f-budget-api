import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  BaseRepository,
  MongoSearch,
  Projection,
  ToObjFromPaginateMongo,
  YestPaginateResult,
} from "@yest/mongoose";
import { PopulateIn } from "@yest/mongoose/dist/src/mongo.interface";
import { ResultHandlerException } from "@yest/router";
import {
  User,
  UserCreate,
  UserPatch,
  UserPopulateField,
  UserSearch,
  UserUpdate,
} from "@yest/yest-stats-api-typescript-fetch";
import { cloneDeep } from "lodash";
import { Model } from "mongoose";

import { configs } from "../../constants/configs.constant";
import { UserDocument } from "./models/user.model";
import { UserWithPasswordDocument } from "./models/user-with-password.model";
import { UserErrors } from "./user.errors";

export type UserModels = {
  model: User;
  modelCreate: UserCreate;
  modelUpdate: UserUpdate;
  modelPatch: UserPatch;
  modelSearch: UserSearch;
  modelPopulate: Array<UserPopulateField>;
  modelDocument: UserDocument;
  modelSearchDistincts: never;
};

@Injectable()
export class UserRepository extends BaseRepository<UserModels> {
  private logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel("MongoUser", configs.mongooseConnectionName)
    public readonly userModel: Model<UserDocument>,
    @InjectModel("MongoUserWithPassword", configs.mongooseConnectionName)
    public readonly userWithPasswordModel: Model<UserWithPasswordDocument>,
  ) {
    super(userModel, UserErrors);
  }

  @ToObjFromPaginateMongo("repoSearch", "userWithPasswordModel")
  public async searchLogin(
    searchParams: UserSearch,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    projection?: Projection,
  ): Promise<YestPaginateResult<User, never>> {
    const searchParamsCloned = cloneDeep(searchParams);
    const { populate } = searchParams;

    // Populate
    if (populate) {
      const pipelineStagePopulate = MongoSearch.buildQueryPopulates(
        searchParamsCloned as UserSearch & { populate: PopulateIn[] },
        this.userWithPasswordModel,
      );
      const resultPopulate = (
        await this.userWithPasswordModel.aggregate(pipelineStagePopulate)
      )[0];
      return resultPopulate;
    }

    // No populate and no Distincts
    const pipelineStage = MongoSearch.buildQuery(searchParamsCloned);
    const results = (
      await this.userWithPasswordModel.aggregate(pipelineStage)
    )[0];
    return results;
  }

  public async create(model: UserCreate, isDryRun?: boolean): Promise<User> {
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
    modelBulk: UserCreate[],
    isDryRun?: boolean,
  ): Promise<User[]> {
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
    searchParams: UserSearch,
    projection?: Projection,
  ): Promise<YestPaginateResult<User, never>> {
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
    populate?: UserPopulateField[],
  ): Promise<User[]> {
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
    populate?: UserPopulateField[],
  ): Promise<User> {
    try {
      const res = await super.getById(modelId, populate);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async patch(modelId: string, model: UserPatch): Promise<User> {
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
    model: UserUpdate,
    isDryRun?: boolean,
  ): Promise<User> {
    try {
      const res = await super.update(modelId, model, isDryRun);
      return res;
    } catch (err) {
      const errorParsed = JSON.parse(err.message);
      this.logger.error(err.message);
      throw new ResultHandlerException(errorParsed.resultHandler);
    }
  }

  public async archive(modelId: string): Promise<User> {
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
