import { ModuleContext } from "../module.e2e-spec";

export function moduleCreateTest(): void {
  let ctx: ModuleContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Module", async () => {
    const result = await ctx.moduleConnector.moduleCreate({
      moduleCreate: ctx.moduleCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.moduleCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Module as dry-run (not saving)", async () => {
    const result = await ctx.moduleConnector.moduleCreate({
      moduleCreate: ctx.moduleCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.moduleConnector.moduleGetById({
      id: result.value!.id,
      modulePopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.moduleCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
