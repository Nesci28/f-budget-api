import {
  RequestApi,
  RequestCreate,
  RequestPatch,
  RequestUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { RequestRepository } from "../request.repository";
import { RequestService } from "../request.service";
import { requestArchiveTest } from "./endpoints/request-archive.e2e";
import { requestCreateTest } from "./endpoints/request-create.e2e";
import { requestGetAllTest } from "./endpoints/request-get-all.e2e";
import { requestGetByIdTest } from "./endpoints/request-get-by-id.e2e";
import { requestPatchTest } from "./endpoints/request-patch.e2e";
import { requestSearchTest } from "./endpoints/request-search.e2e";
import { requestUpdateTest } from "./endpoints/request-update.e2e";

export interface RequestContext extends Context<RequestCreate, RequestUpdate> {
  requestConnector: RequestApi;
  requestService: RequestService;
  requestRepository: RequestRepository;
  requestKey: string;
  requestCreate: RequestCreate;
  requestUpdate: RequestUpdate;
  requestPatch: RequestPatch;
  requestCreates: RequestCreate[];
}

describe("RequestController", () => {
  const ctx = globalThis.context as RequestContext;

  beforeAll(async () => {
    ctx.requestConnector = ctx.testHandler.prepareConnector(
      RequestApi,
      ctx.config,
    );
    ctx.requestService = ctx.testHandler.get("RequestService");
    ctx.requestRepository = ctx.testHandler.get("RequestRepository");

    ctx.requestCreate = ctx.createOne("RequestCreate", ctx.testHandler, false);
    ctx.requestCreates = ctx.createMany(
      "RequestCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "RequestUpdate",
      ctx.requestCreate,
      [],
      ctx.testHandler,
    );
    ctx.requestKey = key;
    ctx.requestUpdate = { ...ctx.requestCreate, ...update };
    ctx.requestPatch = {
      [ctx.requestKey]: ctx.requestUpdate[ctx.requestKey],
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

  describe("Request create", requestCreateTest.bind({ ctx }));
  describe("Request search", requestSearchTest.bind({ ctx }));
  describe("Request getById", requestGetByIdTest.bind({ ctx }));
  describe("Request getAll", requestGetAllTest.bind({ ctx }));
  describe("Request patch", requestPatchTest.bind({ ctx }));
  describe("Request update", requestUpdateTest.bind({ ctx }));
  describe("Request archive", requestArchiveTest.bind({ ctx }));
});
