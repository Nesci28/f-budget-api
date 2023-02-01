import { RequestContext } from "../request.e2e-spec";

export function requestGetAllTest(): void {
  let ctx: RequestContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.requestRepository.createMany(ctx.requestCreates);
  });

  it("should return an array of Requests", async () => {
    const results = await ctx.requestConnector.requestGetAll({
      requestPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
