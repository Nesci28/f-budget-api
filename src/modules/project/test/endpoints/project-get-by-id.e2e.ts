import { Project } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ProjectErrors } from "../../project.errors";
import { ProjectContext } from "../project.e2e-spec";

export function projectGetByIdTest(): void {
  let ctx: ProjectContext;
  let projects: Project[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    projects = await ctx.projectRepository.createMany(ctx.projectCreates);
  });

  it("should return a specific Project", async () => {
    const results = await ctx.projectConnector.projectGetById({
      id: projects[0].id,
      projectPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(projects[0].id);
  });

  it("should return not found when using an invalid Project id", async () => {
    const fakeProjectId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.projectConnector.projectGetById({
      id: fakeProjectId,
      projectPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(ProjectErrors.notFound.uuid);
  });
}
