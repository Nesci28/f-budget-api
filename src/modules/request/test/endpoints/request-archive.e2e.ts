import { StatusCodes } from "http-status-codes";

import { RequestErrors } from "../../request.errors";
import { RequestContext } from "../request.e2e-spec";

export function requestArchiveTest(): void {
  let ctx: RequestContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Request", async () => {
    const request = await ctx.requestRepository.create(ctx.requestCreate);

    const result = await ctx.requestConnector.requestArchive({
      id: request.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Request id", async () => {
    const fakeRequestId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.requestConnector.requestArchive({
      id: fakeRequestId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(RequestErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Request", async () => {
    const request = await ctx.requestRepository.create(ctx.requestCreate);
    await ctx.requestRepository.archive(request.id);

    const result = await ctx.requestConnector.requestArchive({
      id: request.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(RequestErrors.alreadyArchived.uuid);
  });
}
