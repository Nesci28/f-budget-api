import { UserContext } from "../user.e2e-spec";

export function userCreateTest(): void {
  let ctx: UserContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new User", async () => {
    const result = await ctx.userConnector.userCreate({
      userCreate: ctx.userCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(ctx.userCreate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new User as dry-run (not saving)", async () => {
    const result = await ctx.userConnector.userCreate({
      userCreate: ctx.userCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.userConnector.userGetById({
      id: result.value!.id,
      userPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(ctx.userCreate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
