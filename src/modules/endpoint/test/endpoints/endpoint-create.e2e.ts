import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointCreateTest(): void {
  let ctx: EndpointContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Endpoint", async () => {
    const result = await ctx.endpointConnector.endpointCreate({
      endpointCreate: ctx.endpointCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.endpointCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Endpoint as dry-run (not saving)", async () => {
    const result = await ctx.endpointConnector.endpointCreate({
      endpointCreate: ctx.endpointCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.endpointConnector.endpointGetById({
      id: result.value!.id,
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.endpointCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
