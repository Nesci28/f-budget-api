import { Endpoint } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EndpointErrors } from "../../endpoint.errors";
import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointPatchTest(): void {
  let ctx: EndpointContext;
  let endpoint: Endpoint;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    endpoint = await ctx.endpointRepository.create(ctx.endpointCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.endpointConnector.endpointPatch({
      id: endpoint.id,
      endpointPatch: ctx.endpointPatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(endpoint.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.endpointPatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Endpoint", async () => {
    await ctx.endpointRepository.archive(endpoint.id);

    const result = await ctx.endpointConnector.endpointPatch({
      id: endpoint.id,
      endpointPatch: ctx.endpointPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EndpointErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid endpoint id", async () => {
    const fakeEndpointId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.endpointConnector.endpointPatch({
      id: fakeEndpointId,
      endpointPatch: ctx.endpointPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EndpointErrors.notFound.uuid);
  });
}
