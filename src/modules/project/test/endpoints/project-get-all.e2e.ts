import { ProjectContext } from "../project.e2e-spec";

export function projectGetAllTest(): void {
  let ctx: ProjectContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.projectRepository.createMany(ctx.projectCreates);
  });

  it("should return an array of Projects", async () => {
    const results = await ctx.projectConnector.projectGetAll({
      projectPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
