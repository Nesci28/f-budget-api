import { ModuleContext } from "../module.e2e-spec";

export function moduleGetAllTest(): void {
  let ctx: ModuleContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.moduleRepository.createMany(ctx.moduleCreates);
  });

  it("should return an array of Modules", async () => {
    const results = await ctx.moduleConnector.moduleGetAll({
      modulePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
