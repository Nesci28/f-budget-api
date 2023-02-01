import { Project } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { ProjectErrors } from "../../project.errors";
import { ProjectContext } from "../project.e2e-spec";

export function projectUpdateTest(): void {
  let ctx: ProjectContext;
  let project: Project;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    project = await ctx.projectRepository.create(ctx.projectCreate);
  });

  it("should update the specified Project", async () => {
    const result = await ctx.projectConnector.projectUpdate({
      id: project.id,
      projectUpdate: ctx.projectUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(project.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.projectUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Project as dry-run (not saving)", async () => {
    const result = await ctx.projectConnector.projectUpdate({
      id: project.id,
      projectUpdate: ctx.projectUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.projectRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.projectUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(project.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.projectUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Project", async () => {
    await ctx.projectRepository.archive(project.id);

    const result = await ctx.projectConnector.projectUpdate({
      id: project.id,
      projectUpdate: ctx.projectUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(ProjectErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Project id", async () => {
    const fakeProjectId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.projectConnector.projectUpdate({
      id: fakeProjectId,
      projectUpdate: ctx.projectUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(ProjectErrors.notFound.uuid);
  });
}
