import { StatusCodes } from "http-status-codes";

import { ResponseErrors } from "../../response.errors";
import { ResponseContext } from "../response.e2e-spec";

export function responseArchiveTest(): void {
  let ctx: ResponseContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Response", async () => {
    const response = await ctx.responseRepository.create(ctx.responseCreate);

    const result = await ctx.responseConnector.responseArchive({
      id: response.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Response id", async () => {
    const fakeResponseId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.responseConnector.responseArchive({
      id: fakeResponseId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ResponseErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Response", async () => {
    const response = await ctx.responseRepository.create(ctx.responseCreate);
    await ctx.responseRepository.archive(response.id);

    const result = await ctx.responseConnector.responseArchive({
      id: response.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ResponseErrors.alreadyArchived.uuid);
  });
}
