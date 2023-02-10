import { Receipt } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ReceiptErrors } from "../../receipt.errors";
import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptUpdateTest(): void {
  let ctx: ReceiptContext;
  let receipt: Receipt;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    receipt = await ctx.receiptRepository.create(ctx.receiptCreate);
  });

  it("should update the specified Receipt", async () => {
    const result = await ctx.receiptConnector.receiptUpdate({
      id: receipt.id,
      receiptUpdate: ctx.receiptUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(receipt.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.receiptUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Receipt as dry-run (not saving)", async () => {
    const result = await ctx.receiptConnector.receiptUpdate({
      id: receipt.id,
      receiptUpdate: ctx.receiptUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.receiptRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.receiptUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(receipt.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.receiptUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Receipt", async () => {
    await ctx.receiptRepository.archive(receipt.id);

    const result = await ctx.receiptConnector.receiptUpdate({
      id: receipt.id,
      receiptUpdate: ctx.receiptUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ReceiptErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Receipt id", async () => {
    const fakeReceiptId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.receiptConnector.receiptUpdate({
      id: fakeReceiptId,
      receiptUpdate: ctx.receiptUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ReceiptErrors.notFound.uuid);
  });
}
