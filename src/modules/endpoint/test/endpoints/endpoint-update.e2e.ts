import { Endpoint } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EndpointErrors } from "../../endpoint.errors";
import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointUpdateTest(): void {
  let ctx: EndpointContext;
  let endpoint: Endpoint;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    endpoint = await ctx.endpointRepository.create(ctx.endpointCreate);
  });

  it("should update the specified Endpoint", async () => {
    const result = await ctx.endpointConnector.endpointUpdate({
      id: endpoint.id,
      endpointUpdate: ctx.endpointUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(endpoint.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.endpointUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Endpoint as dry-run (not saving)", async () => {
    const result = await ctx.endpointConnector.endpointUpdate({
      id: endpoint.id,
      endpointUpdate: ctx.endpointUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.endpointRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.endpointUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(endpoint.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.endpointUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Endpoint", async () => {
    await ctx.endpointRepository.archive(endpoint.id);

    const result = await ctx.endpointConnector.endpointUpdate({
      id: endpoint.id,
      endpointUpdate: ctx.endpointUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EndpointErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Endpoint id", async () => {
    const fakeEndpointId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.endpointConnector.endpointUpdate({
      id: fakeEndpointId,
      endpointUpdate: ctx.endpointUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EndpointErrors.notFound.uuid);
  });
}
