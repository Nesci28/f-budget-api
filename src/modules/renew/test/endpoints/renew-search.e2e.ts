import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { RenewContext } from "../renew.e2e-spec";

export function renewSearchTest(): void {
  let ctx: RenewContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.renewRepository.createMany(ctx.renewCreates);
  });

  it("should return a paginated array of all Renews", async () => {
    const res = await ctx.renewConnector.renewSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
