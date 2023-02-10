import { BasicOperator } from "@f-budget/f-budget-api-typescript-fetch";

import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopSearchTest(): void {
  let ctx: EnvelopContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.envelopRepository.createMany(ctx.envelopCreates);
  });

  it("should return a paginated array of all Envelops", async () => {
    const res = await ctx.envelopConnector.envelopSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
