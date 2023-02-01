import { ResponseContext } from "../response.e2e-spec";

export function responseGetAllTest(): void {
  let ctx: ResponseContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.responseRepository.createMany(ctx.responseCreates);
  });

  it("should return an array of Responses", async () => {
    const results = await ctx.responseConnector.responseGetAll({
      responsePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
