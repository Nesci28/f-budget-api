import { EndpointContext } from "../endpoint.e2e-spec";

export function endpointGetAllTest(): void {
  let ctx: EndpointContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.endpointRepository.createMany(ctx.endpointCreates);
  });

  it("should return an array of Endpoints", async () => {
    const results = await ctx.endpointConnector.endpointGetAll({});

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
