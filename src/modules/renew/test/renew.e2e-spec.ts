import {
  RenewApi,
  RenewCreate,
  RenewPatch,
  RenewUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { RenewRepository } from "../renew.repository";
import { RenewService } from "../renew.service";
import { renewArchiveTest } from "./endpoints/renew-archive.e2e";
import { renewCreateTest } from "./endpoints/renew-create.e2e";
import { renewGetAllTest } from "./endpoints/renew-get-all.e2e";
import { renewGetByIdTest } from "./endpoints/renew-get-by-id.e2e";
import { renewPatchTest } from "./endpoints/renew-patch.e2e";
import { renewSearchTest } from "./endpoints/renew-search.e2e";
import { renewUpdateTest } from "./endpoints/renew-update.e2e";

export interface RenewContext extends Context<RenewCreate, RenewUpdate> {
  renewConnector: RenewApi;
  renewService: RenewService;
  renewRepository: RenewRepository;
  renewKey: string;
  renewCreate: RenewCreate;
  renewUpdate: RenewUpdate;
  renewPatch: RenewPatch;
  renewCreates: RenewCreate[];
}

describe("RenewController", () => {
  const ctx = globalThis.context as RenewContext;

  beforeAll(async () => {
    ctx.renewConnector = ctx.testHandler.prepareConnector(RenewApi, ctx.config);
    ctx.renewService = ctx.testHandler.get("RenewService");
    ctx.renewRepository = ctx.testHandler.get("RenewRepository");

    ctx.renewCreate = ctx.createOne("RenewCreate", ctx.testHandler, false);
    ctx.renewCreates = ctx.createMany(
      "RenewCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "RenewUpdate",
      ctx.renewCreate,
      [],
      ctx.testHandler,
    );
    ctx.renewKey = key;
    ctx.renewUpdate = { ...ctx.renewCreate, ...update };
    ctx.renewPatch = {
      [ctx.renewKey]: ctx.renewUpdate[ctx.renewKey],
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

  describe("Renew create", renewCreateTest.bind({ ctx }));
  describe("Renew search", renewSearchTest.bind({ ctx }));
  describe("Renew getById", renewGetByIdTest.bind({ ctx }));
  describe("Renew getAll", renewGetAllTest.bind({ ctx }));
  describe("Renew patch", renewPatchTest.bind({ ctx }));
  describe("Renew update", renewUpdateTest.bind({ ctx }));
  describe("Renew archive", renewArchiveTest.bind({ ctx }));
});
