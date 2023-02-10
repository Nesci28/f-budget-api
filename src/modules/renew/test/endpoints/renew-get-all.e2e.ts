import { RenewContext } from "../renew.e2e-spec";

export function renewGetAllTest(): void {
  let ctx: RenewContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.renewRepository.createMany(ctx.renewCreates);
  });

  it("should return an array of Renews", async () => {
    const results = await ctx.renewConnector.renewGetAll({
      renewPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
