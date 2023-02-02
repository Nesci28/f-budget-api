import {
  EndpointApi,
  EndpointCreate,
  EndpointPatch,
  EndpointUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { EndpointRepository } from "../endpoint.repository";
import { EndpointService } from "../endpoint.service";
import { endpointArchiveTest } from "./endpoints/endpoint-archive.e2e";
import { endpointCreateTest } from "./endpoints/endpoint-create.e2e";
import { endpointGetAllTest } from "./endpoints/endpoint-get-all.e2e";
import { endpointGetByIdTest } from "./endpoints/endpoint-get-by-id.e2e";
import { endpointPatchTest } from "./endpoints/endpoint-patch.e2e";
import { endpointSearchTest } from "./endpoints/endpoint-search.e2e";
import { endpointUpdateTest } from "./endpoints/endpoint-update.e2e";

export interface EndpointContext
  extends Context<EndpointCreate, EndpointUpdate> {
  endpointConnector: EndpointApi;
  endpointService: EndpointService;
  endpointRepository: EndpointRepository;
  endpointKey: string;
  endpointCreate: EndpointCreate;
  endpointUpdate: EndpointUpdate;
  endpointPatch: EndpointPatch;
  endpointCreates: EndpointCreate[];
}

describe("EndpointController", () => {
  const ctx = globalThis.context as EndpointContext;

  beforeAll(async () => {
    ctx.endpointConnector = ctx.testHandler.prepareConnector(
      EndpointApi,
      ctx.config,
    );
    ctx.endpointService = ctx.testHandler.get("EndpointService");
    ctx.endpointRepository = ctx.testHandler.get("EndpointRepository");

    ctx.endpointCreate = ctx.createOne(
      "EndpointCreate",
      ctx.testHandler,
      false,
    );
    ctx.endpointCreates = ctx.createMany(
      "EndpointCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "EndpointUpdate",
      ctx.endpointCreate,
      [],
      ctx.testHandler,
    );
    ctx.endpointKey = key;
    ctx.endpointUpdate = { ...ctx.endpointCreate, ...update };
    ctx.endpointPatch = {
      [ctx.endpointKey]: ctx.endpointUpdate[ctx.endpointKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  describe("Endpoint create", endpointCreateTest.bind({ ctx }));
  describe("Endpoint search", endpointSearchTest.bind({ ctx }));
  describe("Endpoint getById", endpointGetByIdTest.bind({ ctx }));
  describe("Endpoint getAll", endpointGetAllTest.bind({ ctx }));
  describe("Endpoint patch", endpointPatchTest.bind({ ctx }));
  describe("Endpoint update", endpointUpdateTest.bind({ ctx }));
  describe("Endpoint archive", endpointArchiveTest.bind({ ctx }));
});
