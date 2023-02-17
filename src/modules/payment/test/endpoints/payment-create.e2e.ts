import { PaymentContext } from "../payment.e2e-spec";

export function paymentCreateTest(): void {
  let ctx: PaymentContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Payment", async () => {
    const result = await ctx.paymentConnector.paymentCreate({
      paymentCreate: ctx.paymentCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.paymentCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Payment as dry-run (not saving)", async () => {
    const result = await ctx.paymentConnector.paymentCreate({
      paymentCreate: ctx.paymentCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.paymentConnector.paymentGetById({
      id: result.value!.id,
      paymentPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.paymentCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
