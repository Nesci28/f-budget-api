import { BalanceContext } from "../balance.e2e-spec";

export function balanceCreateTest(): void {
  let ctx: BalanceContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Balance", async () => {
    const result = await ctx.balanceConnector.balanceCreate({
      balanceCreate: ctx.balanceCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.balanceCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Balance as dry-run (not saving)", async () => {
    const result = await ctx.balanceConnector.balanceCreate({
      balanceCreate: ctx.balanceCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.balanceConnector.balanceGetById({
      id: result.value!.id,
      balancePopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.balanceCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
