import {
  ModuleApi,
  ModuleCreate,
  ModulePatch,
  ModuleUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { ModuleRepository } from "../module.repository";
import { ModuleService } from "../module.service";
import { moduleArchiveTest } from "./endpoints/module-archive.e2e";
import { moduleCreateTest } from "./endpoints/module-create.e2e";
import { moduleGetAllTest } from "./endpoints/module-get-all.e2e";
import { moduleGetByIdTest } from "./endpoints/module-get-by-id.e2e";
import { modulePatchTest } from "./endpoints/module-patch.e2e";
import { moduleSearchTest } from "./endpoints/module-search.e2e";
import { moduleUpdateTest } from "./endpoints/module-update.e2e";

export interface ModuleContext extends Context<ModuleCreate, ModuleUpdate> {
  moduleConnector: ModuleApi;
  moduleService: ModuleService;
  moduleRepository: ModuleRepository;
  moduleKey: string;
  moduleCreate: ModuleCreate;
  moduleUpdate: ModuleUpdate;
  modulePatch: ModulePatch;
  moduleCreates: ModuleCreate[];
}

describe("ModuleController", () => {
  const ctx = globalThis.context as ModuleContext;

  beforeAll(async () => {
    ctx.moduleConnector = ctx.testHandler.prepareConnector(
      ModuleApi,
      ctx.config,
    );
    ctx.moduleService = ctx.testHandler.get("ModuleService");
    ctx.moduleRepository = ctx.testHandler.get("ModuleRepository");

    ctx.moduleCreate = ctx.createOne("ModuleCreate", ctx.testHandler, false);
    ctx.moduleCreates = ctx.createMany(
      "ModuleCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "ModuleUpdate",
      ctx.moduleCreate,
      [],
      ctx.testHandler,
    );
    ctx.moduleKey = key;
    ctx.moduleUpdate = { ...ctx.moduleCreate, ...update };
    ctx.modulePatch = {
      [ctx.moduleKey]: ctx.moduleUpdate[ctx.moduleKey],
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

  describe("Module create", moduleCreateTest.bind({ ctx }));
  describe("Module search", moduleSearchTest.bind({ ctx }));
  describe("Module getById", moduleGetByIdTest.bind({ ctx }));
  describe("Module getAll", moduleGetAllTest.bind({ ctx }));
  describe("Module patch", modulePatchTest.bind({ ctx }));
  describe("Module update", moduleUpdateTest.bind({ ctx }));
  describe("Module archive", moduleArchiveTest.bind({ ctx }));
});
