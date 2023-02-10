import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { BalanceContext } from "../balance.e2e-spec";

export function balanceSearchTest(): void {
  let ctx: BalanceContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.balanceRepository.createMany(ctx.balanceCreates);
  });

  it("should return a paginated array of all Balances", async () => {
    const res = await ctx.balanceConnector.balanceSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
