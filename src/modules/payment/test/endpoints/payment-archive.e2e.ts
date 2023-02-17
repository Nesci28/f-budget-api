import { StatusCodes } from "http-status-codes";

import { PaymentErrors } from "../../payment.errors";
import { PaymentContext } from "../payment.e2e-spec";

export function paymentArchiveTest(): void {
  let ctx: PaymentContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Payment", async () => {
    const payment = await ctx.paymentRepository.create(ctx.paymentCreate);

    const result = await ctx.paymentConnector.paymentArchive({
      id: payment.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Payment id", async () => {
    const fakePaymentId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.paymentConnector.paymentArchive({
      id: fakePaymentId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(PaymentErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Payment", async () => {
    const payment = await ctx.paymentRepository.create(ctx.paymentCreate);
    await ctx.paymentRepository.archive(payment.id);

    const result = await ctx.paymentConnector.paymentArchive({
      id: payment.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(PaymentErrors.alreadyArchived.uuid);
  });
}
