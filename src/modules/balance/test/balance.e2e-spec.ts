import {
  BalanceApi,
  BalanceCreate,
  BalancePatch,
  BalanceUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { BalanceRepository } from "../balance.repository";
import { BalanceService } from "../balance.service";
import { balanceArchiveTest } from "./endpoints/balance-archive.e2e";
import { balanceCreateTest } from "./endpoints/balance-create.e2e";
import { balanceGetAllTest } from "./endpoints/balance-get-all.e2e";
import { balanceGetByIdTest } from "./endpoints/balance-get-by-id.e2e";
import { balancePatchTest } from "./endpoints/balance-patch.e2e";
import { balanceSearchTest } from "./endpoints/balance-search.e2e";
import { balanceUpdateTest } from "./endpoints/balance-update.e2e";

export interface BalanceContext extends Context<BalanceCreate, BalanceUpdate> {
  balanceConnector: BalanceApi;
  balanceService: BalanceService;
  balanceRepository: BalanceRepository;
  balanceKey: string;
  balanceCreate: BalanceCreate;
  balanceUpdate: BalanceUpdate;
  balancePatch: BalancePatch;
  balanceCreates: BalanceCreate[];
}

describe("BalanceController", () => {
  const ctx = globalThis.context as BalanceContext;

  beforeAll(async () => {
    ctx.balanceConnector = ctx.testHandler.prepareConnector(
      BalanceApi,
      ctx.config,
    );
    ctx.balanceService = ctx.testHandler.get("BalanceService");
    ctx.balanceRepository = ctx.testHandler.get("BalanceRepository");

    ctx.balanceCreate = ctx.createOne("BalanceCreate", ctx.testHandler, false);
    ctx.balanceCreates = ctx.createMany(
      "BalanceCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "BalanceUpdate",
      ctx.balanceCreate,
      [],
      ctx.testHandler,
    );
    ctx.balanceKey = key;
    ctx.balanceUpdate = { ...ctx.balanceCreate, ...update };
    ctx.balancePatch = {
      [ctx.balanceKey]: ctx.balanceUpdate[ctx.balanceKey],
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

  describe("Balance create", balanceCreateTest.bind({ ctx }));
  describe("Balance search", balanceSearchTest.bind({ ctx }));
  describe("Balance getById", balanceGetByIdTest.bind({ ctx }));
  describe("Balance getAll", balanceGetAllTest.bind({ ctx }));
  describe("Balance patch", balancePatchTest.bind({ ctx }));
  describe("Balance update", balanceUpdateTest.bind({ ctx }));
  describe("Balance archive", balanceArchiveTest.bind({ ctx }));
});
