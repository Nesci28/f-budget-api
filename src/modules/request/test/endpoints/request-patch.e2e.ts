import { Request } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { RequestErrors } from "../../request.errors";
import { RequestContext } from "../request.e2e-spec";

export function requestPatchTest(): void {
  let ctx: RequestContext;
  let request: Request;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    request = await ctx.requestRepository.create(ctx.requestCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.requestConnector.requestPatch({
      id: request.id,
      requestPatch: ctx.requestPatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(request.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.requestPatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Request", async () => {
    await ctx.requestRepository.archive(request.id);

    const result = await ctx.requestConnector.requestPatch({
      id: request.id,
      requestPatch: ctx.requestPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(RequestErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid request id", async () => {
    const fakeRequestId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.requestConnector.requestPatch({
      id: fakeRequestId,
      requestPatch: ctx.requestPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(RequestErrors.notFound.uuid);
  });
}
