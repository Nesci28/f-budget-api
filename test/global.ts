/* eslint-disable no-param-reassign */

import { MongoMemoryHandler } from "@yest/mongoose-test";
import { SecurityService } from "@yest/security";
import { TestHandler } from "@yest/test";
import { OptionIdMap } from "@yest/test/dist/src/handler";
import {
  BaseModel,
  Configuration,
} from "@yest/yest-stats-api-typescript-fetch";
import { get, isEqual } from "lodash";
import mongoose from "mongoose";

import { configs } from "../src/constants/configs.constant";

export interface Context<T, U> {
  testHandler: TestHandler;
  mongoMemory: MongoMemoryHandler;
  jwtToken: string;
  config: Configuration;
  jwtTokenMember: string;
  configMember: Configuration;
  memberUserId: string;
  securityService: SecurityService;
  createOne: (
    modelName: string,
    testHandler: TestHandler,
    createMongoFields?: boolean,
    isArchived?: boolean,
  ) => T;
  createMany: (
    modelName: string,
    testHandler: TestHandler,
    createMongoFields?: boolean,
    amountToCreate?: number,
  ) => T[];
  updateField: (
    modelName: string,
    modelCreate: T,
    forbiddenFields: string[],
    testHandler: TestHandler,
  ) => { key: string; update: U };
}

export function updateField<T extends Record<any, any>, U>(
  modelName: string,
  modelCreate: U,
  forbiddenFields: string[],
  testHandler: TestHandler,
): { key: string; update: U } {
  forbiddenFields.push("id", "updatedAt", "createdAt", "archived");
  let field;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    field = testHandler.fakeField<T>(
      modelName,
      configs.resolvedPath,
      modelCreate,
    );
    const key = Object.keys(field)[0];
    const isForbidden = forbiddenFields.includes(key);
    const isSameValue = isEqual(get(modelCreate, key), field[key]);
    if (!isForbidden && !isSameValue) {
      break;
    }
  }
  const key = Object.keys(field)[0] as string;
  const update = { ...modelCreate, ...field };
  return { key, update };
}

export function createMany<T extends BaseModel>(
  modelName: string,
  testHandler: TestHandler,
  createMongoFields = true,
  amountToCreate = 100,
): T[] {
  const bulk = [...Array(amountToCreate).keys()].map(() => {
    const fakeObject = testHandler.fakeObject<T>(
      modelName,
      configs.resolvedPath,
    );
    if (createMongoFields) {
      fakeObject.id = new mongoose.Types.ObjectId().toHexString();
      fakeObject.archived = false;
    }
    return fakeObject;
  });

  return bulk;
}

export function createOne<T extends BaseModel>(
  modelName: string,
  testHandler: TestHandler,
  createMongoFields = true,
  isArchived = false,
): T {
  const model = testHandler.fakeObject<T>(modelName, configs.resolvedPath);
  if (createMongoFields) {
    model.id = new mongoose.Types.ObjectId().toHexString();
    model.archived = isArchived;
  }
  return model;
}

export function generateOptionIdMap(): OptionIdMap {
  const stringId = new mongoose.Types.ObjectId().toHexString();
  const translationTextId = new mongoose.Types.ObjectId().toHexString();
  const numberId = new mongoose.Types.ObjectId().toHexString();
  const booleanId = new mongoose.Types.ObjectId().toHexString();
  const dateId = new mongoose.Types.ObjectId().toHexString();

  return {
    string: stringId,
    translatableText: translationTextId,
    number: numberId,
    boolean: booleanId,
    date: dateId,
  };
}

export async function cleanDbs(ctx: Context<any, any>): Promise<void> {
  await ctx.mongoMemory.clean();
}
