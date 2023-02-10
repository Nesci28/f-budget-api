import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { UploadContext } from "../upload.e2e-spec";

export function uploadSearchTest(): void {
  let ctx: UploadContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.uploadRepository.createMany(ctx.uploadCreates);
  });

  it("should return a paginated array of all Uploads", async () => {
    const res = await ctx.uploadConnector.uploadSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
