import { StatusCodes } from "http-status-codes";

import { ProjectErrors } from "../../project.errors";
import { ProjectContext } from "../project.e2e-spec";

export function projectArchiveTest(): void {
  let ctx: ProjectContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Project", async () => {
    const project = await ctx.projectRepository.create(ctx.projectCreate);

    const result = await ctx.projectConnector.projectArchive({
      id: project.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Project id", async () => {
    const fakeProjectId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.projectConnector.projectArchive({
      id: fakeProjectId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ProjectErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Project", async () => {
    const project = await ctx.projectRepository.create(ctx.projectCreate);
    await ctx.projectRepository.archive(project.id);

    const result = await ctx.projectConnector.projectArchive({
      id: project.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ProjectErrors.alreadyArchived.uuid);
  });
}
