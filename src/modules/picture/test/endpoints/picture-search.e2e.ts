import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { PictureContext } from "../picture.e2e-spec";

export function pictureSearchTest(): void {
  let ctx: PictureContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.pictureRepository.createMany(ctx.pictureCreates);
  });

  it("should return a paginated array of all Pictures", async () => {
    const res = await ctx.pictureConnector.pictureSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
