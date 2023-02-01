import { BasicOperator } from "@yest/yest-stats-api-typescript-fetch";

import { ProjectContext } from "../project.e2e-spec";

export function projectSearchTest(): void {
  let ctx: ProjectContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.projectRepository.createMany(ctx.projectCreates);
  });

  it("should return a paginated array of all Projects", async () => {
    const res = await ctx.projectConnector.projectSearch({
      body: {
        and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
        pagination: { page: 1, limit: 2 },
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.length).toEqual(2);
  });
}
