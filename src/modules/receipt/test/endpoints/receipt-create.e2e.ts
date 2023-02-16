import {
  EnvelopCreate,
  EnvelopType,
  UserCreate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptCreateTest(): void {
  let ctx: ReceiptContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    const userCreate: UserCreate = {
      email: "test@test.com",
      password: "testtest",
    };
    const user = await ctx.userService.create(userCreate);

    const envelopCreate: EnvelopCreate = {
      id: ctx.receiptCreate.envelopId,
      userId: user.id,
      name: "test",
      budget: 10000000000000,
      type: EnvelopType.Outcome,
    } as any;
    const envelop = await ctx.envelopRepository.create(envelopCreate);

    ctx.receiptCreate.userId = user.id;
    ctx.receiptCreate.envelopId = envelop.id;
  });

  it("should create a new Receipt", async () => {
    const result = await ctx.receiptConnector.receiptCreate({
      receiptCreate: ctx.receiptCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.receiptCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Receipt as dry-run (not saving)", async () => {
    const result = await ctx.receiptConnector.receiptCreate({
      receiptCreate: ctx.receiptCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.receiptConnector.receiptGetById({
      id: result.value!.id,
      receiptPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.receiptCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
