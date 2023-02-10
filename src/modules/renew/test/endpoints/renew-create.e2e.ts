import { RenewContext } from "../renew.e2e-spec";

export function renewCreateTest(): void {
  let ctx: RenewContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Renew", async () => {
    const result = await ctx.renewConnector.renewCreate({
      renewCreate: ctx.renewCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(ctx.renewCreate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Renew as dry-run (not saving)", async () => {
    const result = await ctx.renewConnector.renewCreate({
      renewCreate: ctx.renewCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.renewConnector.renewGetById({
      id: result.value!.id,
      renewPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(ctx.renewCreate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
