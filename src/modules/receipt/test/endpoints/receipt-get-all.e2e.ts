import { ReceiptContext } from "../receipt.e2e-spec";

export function receiptGetAllTest(): void {
  let ctx: ReceiptContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.receiptRepository.createMany(ctx.receiptCreates);
  });

  it("should return an array of Receipts", async () => {
    const results = await ctx.receiptConnector.receiptGetAll({
      receiptPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
