import { BalanceContext } from "../balance.e2e-spec";

export function balanceGetAllTest(): void {
  let ctx: BalanceContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.balanceRepository.createMany(ctx.balanceCreates);
  });

  it("should return an array of Balances", async () => {
    const results = await ctx.balanceConnector.balanceGetAll({
      balancePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
