import { Request } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { RequestErrors } from "../../request.errors";
import { RequestContext } from "../request.e2e-spec";

export function requestGetByIdTest(): void {
  let ctx: RequestContext;
  let requests: Request[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    requests = await ctx.requestRepository.createMany(ctx.requestCreates);
  });

  it("should return a specific Request", async () => {
    const results = await ctx.requestConnector.requestGetById({
      id: requests[0].id,
      requestPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(requests[0].id);
  });

  it("should return not found when using an invalid Request id", async () => {
    const fakeRequestId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.requestConnector.requestGetById({
      id: fakeRequestId,
      requestPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(RequestErrors.notFound.uuid);
  });
}
