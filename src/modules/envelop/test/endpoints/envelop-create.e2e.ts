import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopCreateTest(): void {
  let ctx: EnvelopContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Envelop", async () => {
    const result = await ctx.envelopConnector.envelopCreate({
      envelopCreate: ctx.envelopCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.envelopCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Envelop as dry-run (not saving)", async () => {
    const result = await ctx.envelopConnector.envelopCreate({
      envelopCreate: ctx.envelopCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.envelopConnector.envelopGetById({
      id: result.value!.id,
      envelopPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.envelopCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
