import { Endpoint } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EndpointErrors } from "../../endpoint.errors";
import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointGetByIdTest(): void {
  let ctx: EndpointContext;
  let endpoints: Endpoint[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    endpoints = await ctx.endpointRepository.createMany(ctx.endpointCreates);
  });

  it("should return a specific Endpoint", async () => {
    const results = await ctx.endpointConnector.endpointGetById({
      id: endpoints[0].id,
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(endpoints[0].id);
  });

  it("should return not found when using an invalid Endpoint id", async () => {
    const fakeEndpointId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.endpointConnector.endpointGetById({
      id: fakeEndpointId,
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(EndpointErrors.notFound.uuid);
  });
}
