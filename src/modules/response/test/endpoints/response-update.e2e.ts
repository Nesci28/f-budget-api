import { Response } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ResponseErrors } from "../../response.errors";
import { ResponseContext } from "../response.e2e-spec";

export function responseUpdateTest(): void {
  let ctx: ResponseContext;
  let response: Response;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    response = await ctx.responseRepository.create(ctx.responseCreate);
  });

  it("should update the specified Response", async () => {
    const result = await ctx.responseConnector.responseUpdate({
      id: response.id,
      responseUpdate: ctx.responseUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(response.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.responseUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Response as dry-run (not saving)", async () => {
    const result = await ctx.responseConnector.responseUpdate({
      id: response.id,
      responseUpdate: ctx.responseUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.responseRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.responseUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(response.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.responseUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Response", async () => {
    await ctx.responseRepository.archive(response.id);

    const result = await ctx.responseConnector.responseUpdate({
      id: response.id,
      responseUpdate: ctx.responseUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ResponseErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Response id", async () => {
    const fakeResponseId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.responseConnector.responseUpdate({
      id: fakeResponseId,
      responseUpdate: ctx.responseUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ResponseErrors.notFound.uuid);
  });
}
