import { BasicOperator } from "@yest/yest-stats-api-typescript-fetch";

import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointSearchTest(): void {
  let ctx: EndpointContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.endpointRepository.createMany(ctx.endpointCreates);
  });

  it("should return a paginated array of all Endpoints", async () => {
    const res = await ctx.endpointConnector.endpointSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
