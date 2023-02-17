import { Payment } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { PaymentErrors } from "../../payment.errors";
import { PaymentContext } from "../payment.e2e-spec";

export function paymentUpdateTest(): void {
  let ctx: PaymentContext;
  let payment: Payment;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    payment = await ctx.paymentRepository.create(ctx.paymentCreate);
  });

  it("should update the specified Payment", async () => {
    const result = await ctx.paymentConnector.paymentUpdate({
      id: payment.id,
      paymentUpdate: ctx.paymentUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(payment.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.paymentUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Payment as dry-run (not saving)", async () => {
    const result = await ctx.paymentConnector.paymentUpdate({
      id: payment.id,
      paymentUpdate: ctx.paymentUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.paymentRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.paymentUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(payment.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.paymentUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Payment", async () => {
    await ctx.paymentRepository.archive(payment.id);

    const result = await ctx.paymentConnector.paymentUpdate({
      id: payment.id,
      paymentUpdate: ctx.paymentUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(PaymentErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Payment id", async () => {
    const fakePaymentId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.paymentConnector.paymentUpdate({
      id: fakePaymentId,
      paymentUpdate: ctx.paymentUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(PaymentErrors.notFound.uuid);
  });
}
