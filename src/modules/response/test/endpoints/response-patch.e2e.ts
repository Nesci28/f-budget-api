import { Response } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ResponseErrors } from "../../response.errors";
import { ResponseContext } from "../response.e2e-spec";

export function responsePatchTest(): void {
  let ctx: ResponseContext;
  let response: Response;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    response = await ctx.responseRepository.create(ctx.responseCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.responseConnector.responsePatch({
      id: response.id,
      responsePatch: ctx.responsePatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(response.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.responsePatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Response", async () => {
    await ctx.responseRepository.archive(response.id);

    const result = await ctx.responseConnector.responsePatch({
      id: response.id,
      responsePatch: ctx.responsePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ResponseErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid response id", async () => {
    const fakeResponseId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.responseConnector.responsePatch({
      id: fakeResponseId,
      responsePatch: ctx.responsePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ResponseErrors.notFound.uuid);
  });
}
