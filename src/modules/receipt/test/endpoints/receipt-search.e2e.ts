import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptSearchTest(): void {
  let ctx: ReceiptContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.receiptRepository.createMany(ctx.receiptCreates);
  });

  it("should return a paginated array of all Receipts", async () => {
    const res = await ctx.receiptConnector.receiptSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
