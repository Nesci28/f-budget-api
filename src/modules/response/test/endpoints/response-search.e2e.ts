import { BasicOperator } from "@yest/yest-stats-api-typescript-fetch";

import { ResponseContext } from "../response.e2e-spec";

export function responseSearchTest(): void {
  let ctx: ResponseContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.responseRepository.createMany(ctx.responseCreates);
  });

  it("should return a paginated array of all Responses", async () => {
    const res = await ctx.responseConnector.responseSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
