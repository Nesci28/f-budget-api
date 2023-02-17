import { Payment } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { PaymentErrors } from "../../payment.errors";
import { PaymentContext } from "../payment.e2e-spec";

export function paymentGetByIdTest(): void {
  let ctx: PaymentContext;
  let payments: Payment[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    payments = await ctx.paymentRepository.createMany(ctx.paymentCreates);
  });

  it("should return a specific Payment", async () => {
    const results = await ctx.paymentConnector.paymentGetById({
      id: payments[0].id,
      paymentPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(payments[0].id);
  });

  it("should return not found when using an invalid Payment id", async () => {
    const fakePaymentId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.paymentConnector.paymentGetById({
      id: fakePaymentId,
      paymentPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(PaymentErrors.notFound.uuid);
  });
}
