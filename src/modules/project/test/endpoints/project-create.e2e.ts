import { ProjectContext } from "../project.e2e-spec";

export function projectCreateTest(): void {
  let ctx: ProjectContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Project", async () => {
    const result = await ctx.projectConnector.projectCreate({
      projectCreate: ctx.projectCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.projectCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Project as dry-run (not saving)", async () => {
    const result = await ctx.projectConnector.projectCreate({
      projectCreate: ctx.projectCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.projectConnector.projectGetById({
      id: result.value!.id,
      projectPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.projectCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
