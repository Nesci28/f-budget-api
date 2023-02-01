import { Module } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ModuleErrors } from "../../module.errors";
import { ModuleContext } from "../module.e2e-spec";

export function moduleGetByIdTest(): void {
  let ctx: ModuleContext;
  let modules: Module[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    modules = await ctx.moduleRepository.createMany(ctx.moduleCreates);
  });

  it("should return a specific Module", async () => {
    const results = await ctx.moduleConnector.moduleGetById({
      id: modules[0].id,
      modulePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(modules[0].id);
  });

  it("should return not found when using an invalid Module id", async () => {
    const fakeModuleId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.moduleConnector.moduleGetById({
      id: fakeModuleId,
      modulePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(ModuleErrors.notFound.uuid);
  });
}
