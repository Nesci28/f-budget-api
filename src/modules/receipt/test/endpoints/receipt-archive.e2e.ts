import { StatusCodes } from "http-status-codes";

import { ReceiptErrors } from "../../receipt.errors";
import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptArchiveTest(): void {
  let ctx: ReceiptContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Receipt", async () => {
    const receipt = await ctx.receiptRepository.create(ctx.receiptCreate);

    const result = await ctx.receiptConnector.receiptArchive({
      id: receipt.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Receipt id", async () => {
    const fakeReceiptId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.receiptConnector.receiptArchive({
      id: fakeReceiptId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ReceiptErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Receipt", async () => {
    const receipt = await ctx.receiptRepository.create(ctx.receiptCreate);
    await ctx.receiptRepository.archive(receipt.id);

    const result = await ctx.receiptConnector.receiptArchive({
      id: receipt.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ReceiptErrors.alreadyArchived.uuid);
  });
}
