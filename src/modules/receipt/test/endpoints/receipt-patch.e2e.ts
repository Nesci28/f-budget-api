import { Receipt } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ReceiptErrors } from "../../receipt.errors";
import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptPatchTest(): void {
  let ctx: ReceiptContext;
  let receipt: Receipt;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    receipt = await ctx.receiptRepository.create(ctx.receiptCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.receiptConnector.receiptPatch({
      id: receipt.id,
      receiptPatch: ctx.receiptPatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(receipt.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.receiptPatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Receipt", async () => {
    await ctx.receiptRepository.archive(receipt.id);

    const result = await ctx.receiptConnector.receiptPatch({
      id: receipt.id,
      receiptPatch: ctx.receiptPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ReceiptErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid receipt id", async () => {
    const fakeReceiptId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.receiptConnector.receiptPatch({
      id: fakeReceiptId,
      receiptPatch: ctx.receiptPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ReceiptErrors.notFound.uuid);
  });
}
