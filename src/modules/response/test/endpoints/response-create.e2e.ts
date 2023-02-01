import { ResponseContext } from "../response.e2e-spec";

export function responseCreateTest(): void {
  let ctx: ResponseContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Response", async () => {
    const result = await ctx.responseConnector.responseCreate({
      responseCreate: ctx.responseCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.responseCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Response as dry-run (not saving)", async () => {
    const result = await ctx.responseConnector.responseCreate({
      responseCreate: ctx.responseCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.responseConnector.responseGetById({
      id: result.value!.id,
      responsePopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.responseCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
