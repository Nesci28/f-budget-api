import { StatusCodes } from "http-status-codes";

import { ModuleErrors } from "../../module.errors";
import { ModuleContext } from "../module.e2e-spec";

export function moduleArchiveTest(): void {
  let ctx: ModuleContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Module", async () => {
    const module = await ctx.moduleRepository.create(ctx.moduleCreate);

    const result = await ctx.moduleConnector.moduleArchive({ id: module.id });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Module id", async () => {
    const fakeModuleId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.moduleConnector.moduleArchive({
      id: fakeModuleId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ModuleErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Module", async () => {
    const module = await ctx.moduleRepository.create(ctx.moduleCreate);
    await ctx.moduleRepository.archive(module.id);

    const result = await ctx.moduleConnector.moduleArchive({ id: module.id });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ModuleErrors.alreadyArchived.uuid);
  });
}
