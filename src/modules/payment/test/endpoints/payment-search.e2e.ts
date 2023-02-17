import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { PaymentContext } from "../payment.e2e-spec";

export function paymentSearchTest(): void {
  let ctx: PaymentContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.paymentRepository.createMany(ctx.paymentCreates);
  });

  it("should return a paginated array of all Payments", async () => {
    const res = await ctx.paymentConnector.paymentSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
