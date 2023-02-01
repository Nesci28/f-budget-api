import {
  ResponseApi,
  ResponseCreate,
  ResponsePatch,
  ResponseUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { ResponseRepository } from "../response.repository";
import { ResponseService } from "../response.service";
import { responseArchiveTest } from "./endpoints/response-archive.e2e";
import { responseCreateTest } from "./endpoints/response-create.e2e";
import { responseGetAllTest } from "./endpoints/response-get-all.e2e";
import { responseGetByIdTest } from "./endpoints/response-get-by-id.e2e";
import { responsePatchTest } from "./endpoints/response-patch.e2e";
import { responseSearchTest } from "./endpoints/response-search.e2e";
import { responseUpdateTest } from "./endpoints/response-update.e2e";

export interface ResponseContext
  extends Context<ResponseCreate, ResponseUpdate> {
  responseConnector: ResponseApi;
  responseService: ResponseService;
  responseRepository: ResponseRepository;
  responseKey: string;
  responseCreate: ResponseCreate;
  responseUpdate: ResponseUpdate;
  responsePatch: ResponsePatch;
  responseCreates: ResponseCreate[];
}

describe("ResponseController", () => {
  const ctx = globalThis.context as ResponseContext;

  beforeAll(async () => {
    ctx.responseConnector = ctx.testHandler.prepareConnector(
      ResponseApi,
      ctx.config,
    );
    ctx.responseService = ctx.testHandler.get("ResponseService");
    ctx.responseRepository = ctx.testHandler.get("ResponseRepository");

    ctx.responseCreate = ctx.createOne(
      "ResponseCreate",
      ctx.testHandler,
      false,
    );
    ctx.responseCreates = ctx.createMany(
      "ResponseCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "ResponseUpdate",
      ctx.responseCreate,
      [],
      ctx.testHandler,
    );
    ctx.responseKey = key;
    ctx.responseUpdate = { ...ctx.responseCreate, ...update };
    ctx.responsePatch = {
      [ctx.responseKey]: ctx.responseUpdate[ctx.responseKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    await ctx.createOptionIds(
      ctx.testHandler,
      ctx.propertyControlRepository,
      ctx.propertyControlOptionRepository,
    );
    jest.restoreAllMocks();
  });

  describe("Response create", responseCreateTest.bind({ ctx }));
  describe("Response search", responseSearchTest.bind({ ctx }));
  describe("Response getById", responseGetByIdTest.bind({ ctx }));
  describe("Response getAll", responseGetAllTest.bind({ ctx }));
  describe("Response patch", responsePatchTest.bind({ ctx }));
  describe("Response update", responseUpdateTest.bind({ ctx }));
  describe("Response archive", responseArchiveTest.bind({ ctx }));
});
