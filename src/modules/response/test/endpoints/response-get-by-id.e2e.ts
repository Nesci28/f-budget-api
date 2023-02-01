import { Response } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ResponseErrors } from "../../response.errors";
import { ResponseContext } from "../response.e2e-spec";

export function responseGetByIdTest(): void {
  let ctx: ResponseContext;
  let responses: Response[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    responses = await ctx.responseRepository.createMany(ctx.responseCreates);
  });

  it("should return a specific Response", async () => {
    const results = await ctx.responseConnector.responseGetById({
      id: responses[0].id,
      responsePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(responses[0].id);
  });

  it("should return not found when using an invalid Response id", async () => {
    const fakeResponseId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.responseConnector.responseGetById({
      id: fakeResponseId,
      responsePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(ResponseErrors.notFound.uuid);
  });
}
