import { Receipt } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ReceiptErrors } from "../../receipt.errors";
import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptGetByIdTest(): void {
  let ctx: ReceiptContext;
  let receipts: Receipt[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    receipts = await ctx.receiptRepository.createMany(ctx.receiptCreates);
  });

  it("should return a specific Receipt", async () => {
    const results = await ctx.receiptConnector.receiptGetById({
      id: receipts[0].id,
      receiptPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(receipts[0].id);
  });

  it("should return not found when using an invalid Receipt id", async () => {
    const fakeReceiptId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.receiptConnector.receiptGetById({
      id: fakeReceiptId,
      receiptPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(ReceiptErrors.notFound.uuid);
  });
}
