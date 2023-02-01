import { RequestContext } from "../request.e2e-spec";

export function requestCreateTest(): void {
  let ctx: RequestContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Request", async () => {
    const result = await ctx.requestConnector.requestCreate({
      requestCreate: ctx.requestCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.requestCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Request as dry-run (not saving)", async () => {
    const result = await ctx.requestConnector.requestCreate({
      requestCreate: ctx.requestCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.requestConnector.requestGetById({
      id: result.value!.id,
      requestPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.requestCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
