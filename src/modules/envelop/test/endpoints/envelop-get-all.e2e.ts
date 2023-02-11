import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopGetAllTest(): void {
  let ctx: EnvelopContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.envelopRepository.createMany(ctx.envelopCreates);
  });

  it("should return an array of Envelops", async () => {
    const results = await ctx.envelopConnector.envelopGetAll({
      envelopPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
