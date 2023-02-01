import { StatusCodes } from "http-status-codes";

import { EndpointErrors } from "../../endpoint.errors";
import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointArchiveTest(): void {
  let ctx: EndpointContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Endpoint", async () => {
    const endpoint = await ctx.endpointRepository.create(ctx.endpointCreate);

    const result = await ctx.endpointConnector.endpointArchive({
      id: endpoint.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Endpoint id", async () => {
    const fakeEndpointId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.endpointConnector.endpointArchive({
      id: fakeEndpointId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EndpointErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Endpoint", async () => {
    const endpoint = await ctx.endpointRepository.create(ctx.endpointCreate);
    await ctx.endpointRepository.archive(endpoint.id);

    const result = await ctx.endpointConnector.endpointArchive({
      id: endpoint.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EndpointErrors.alreadyArchived.uuid);
  });
}
