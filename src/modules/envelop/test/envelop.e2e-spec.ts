import {
  Configuration,
  Envelop,
  EnvelopApi,
  EnvelopCreate,
  EnvelopPatch,
  EnvelopUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { EnvelopRepository } from "../envelop.repository";
import { EnvelopService } from "../envelop.service";
import { envelopArchiveTest } from "./endpoints/envelop-archive.e2e";
import { envelopCreateTest } from "./endpoints/envelop-create.e2e";
import { envelopGetAllTest } from "./endpoints/envelop-get-all.e2e";
import { envelopGetByIdTest } from "./endpoints/envelop-get-by-id.e2e";
import { envelopPatchTest } from "./endpoints/envelop-patch.e2e";
import { envelopSearchTest } from "./endpoints/envelop-search.e2e";
import { envelopUpdateTest } from "./endpoints/envelop-update.e2e";

export interface EnvelopContext extends Context<EnvelopCreate, EnvelopUpdate> {
  envelopConnector: EnvelopApi;
  envelopService: EnvelopService;
  envelopRepository: EnvelopRepository;
  envelopKey: string;
  envelopCreate: EnvelopCreate;
  envelopUpdate: EnvelopUpdate;
  envelopPatch: EnvelopPatch;
  envelopCreates: EnvelopCreate[];
}

describe("EnvelopController", () => {
  const ctx = globalThis.context as EnvelopContext;

  beforeAll(async () => {
    ctx.envelopConnector = ctx.testHandler.prepareConnector(EnvelopApi, ctx.config);
    ctx.envelopService = ctx.testHandler.get("EnvelopService");
    ctx.envelopRepository = ctx.testHandler.get("EnvelopRepository");

    ctx.envelopCreate = ctx.createOne(
      "EnvelopCreate",
      ctx.testHandler,
      false,
    );
    ctx.envelopCreates = ctx.createMany(
      "EnvelopCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "EnvelopUpdate",
      ctx.envelopCreate,
      [],
      ctx.testHandler,
    );
    ctx.envelopKey = key;
    ctx.envelopUpdate = { ...ctx.envelopCreate, ...update };
    ctx.envelopPatch = {
      [ctx.envelopKey]: ctx.envelopUpdate[ctx.envelopKey],
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

  describe("Envelop create", envelopCreateTest.bind({ ctx }));
  describe("Envelop search", envelopSearchTest.bind({ ctx }));
  describe("Envelop getById", envelopGetByIdTest.bind({ ctx }));
  describe("Envelop getAll", envelopGetAllTest.bind({ ctx }));
  describe("Envelop patch", envelopPatchTest.bind({ ctx }));
  describe("Envelop update", envelopUpdateTest.bind({ ctx }));
  describe("Envelop archive", envelopArchiveTest.bind({ ctx }));
});
