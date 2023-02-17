import { PaymentContext } from "../payment.e2e-spec";

export function paymentGetAllTest(): void {
  let ctx: PaymentContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.paymentRepository.createMany(ctx.paymentCreates);
  });

  it("should return an array of Payments", async () => {
    const results = await ctx.paymentConnector.paymentGetAll({
      paymentPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
