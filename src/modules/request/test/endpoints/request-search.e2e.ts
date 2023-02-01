import { BasicOperator } from "@yest/yest-stats-api-typescript-fetch";

import { RequestContext } from "../request.e2e-spec";

export function requestSearchTest(): void {
  let ctx: RequestContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.requestRepository.createMany(ctx.requestCreates);
  });

  it("should return a paginated array of all Requests", async () => {
    const res = await ctx.requestConnector.requestSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
