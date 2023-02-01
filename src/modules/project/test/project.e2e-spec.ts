import {
  ProjectApi,
  ProjectCreate,
  ProjectPatch,
  ProjectUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { ProjectRepository } from "../project.repository";
import { ProjectService } from "../project.service";
import { projectArchiveTest } from "./endpoints/project-archive.e2e";
import { projectCreateTest } from "./endpoints/project-create.e2e";
import { projectGetAllTest } from "./endpoints/project-get-all.e2e";
import { projectGetByIdTest } from "./endpoints/project-get-by-id.e2e";
import { projectPatchTest } from "./endpoints/project-patch.e2e";
import { projectSearchTest } from "./endpoints/project-search.e2e";
import { projectUpdateTest } from "./endpoints/project-update.e2e";

export interface ProjectContext extends Context<ProjectCreate, ProjectUpdate> {
  projectConnector: ProjectApi;
  projectService: ProjectService;
  projectRepository: ProjectRepository;
  projectKey: string;
  projectCreate: ProjectCreate;
  projectUpdate: ProjectUpdate;
  projectPatch: ProjectPatch;
  projectCreates: ProjectCreate[];
}

describe("ProjectController", () => {
  const ctx = globalThis.context as ProjectContext;

  beforeAll(async () => {
    ctx.projectConnector = ctx.testHandler.prepareConnector(
      ProjectApi,
      ctx.config,
    );
    ctx.projectService = ctx.testHandler.get("ProjectService");
    ctx.projectRepository = ctx.testHandler.get("ProjectRepository");

    ctx.projectCreate = ctx.createOne("ProjectCreate", ctx.testHandler, false);
    ctx.projectCreates = ctx.createMany(
      "ProjectCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "ProjectUpdate",
      ctx.projectCreate,
      [],
      ctx.testHandler,
    );
    ctx.projectKey = key;
    ctx.projectUpdate = { ...ctx.projectCreate, ...update };
    ctx.projectPatch = {
      [ctx.projectKey]: ctx.projectUpdate[ctx.projectKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    await ctx.createOptionIds(
      ctx.testHandler,
      ctx.propertyControlRepository,
      ctx.propertyControlOptionRepository,
    );
    jest.restoreAllMocks();
  });

  describe("Project create", projectCreateTest.bind({ ctx }));
  describe("Project search", projectSearchTest.bind({ ctx }));
  describe("Project getById", projectGetByIdTest.bind({ ctx }));
  describe("Project getAll", projectGetAllTest.bind({ ctx }));
  describe("Project patch", projectPatchTest.bind({ ctx }));
  describe("Project update", projectUpdateTest.bind({ ctx }));
  describe("Project archive", projectArchiveTest.bind({ ctx }));
});
