import { Module } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ModuleErrors } from "../../module.errors";
import { ModuleContext } from "../module.e2e-spec";

export function modulePatchTest(): void {
  let ctx: ModuleContext;
  let module: Module;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    module = await ctx.moduleRepository.create(ctx.moduleCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.moduleConnector.modulePatch({
      id: module.id,
      modulePatch: ctx.modulePatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(module.id);
    const res = ctx.testHandler.traverseObjects(ctx.modulePatch, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Module", async () => {
    await ctx.moduleRepository.archive(module.id);

    const result = await ctx.moduleConnector.modulePatch({
      id: module.id,
      modulePatch: ctx.modulePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ModuleErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid module id", async () => {
    const fakeModuleId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.moduleConnector.modulePatch({
      id: fakeModuleId,
      modulePatch: ctx.modulePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ModuleErrors.notFound.uuid);
  });
}
