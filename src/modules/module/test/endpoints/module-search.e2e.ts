import { BasicOperator } from "@yest/yest-stats-api-typescript-fetch";

import { ModuleContext } from "../module.e2e-spec";

export function moduleSearchTest(): void {
  let ctx: ModuleContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.moduleRepository.createMany(ctx.moduleCreates);
  });

  it("should return a paginated array of all Modules", async () => {
    const res = await ctx.moduleConnector.moduleSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
