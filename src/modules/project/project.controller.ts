import {
  Body,
  Controller,
  Param,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";
import {
  ProjectArchiveResponse,
  ProjectCreate,
  ProjectCreateResponse,
  ProjectFindByIdResponse,
  ProjectGetAllResponse,
  ProjectPatch,
  ProjectPatchResponse,
  ProjectPopulateRequestBody,
  ProjectSearch,
  ProjectSearchResponse,
  ProjectUpdate,
  ProjectUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";
import { Express } from "express";

import { ProjectService } from "./project.service";

@Controller()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtTokenGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: "resolvedFile", maxCount: 1 },
      { name: "logoFile", maxCount: 1 },
    ]),
  )
  public async projectCreate(
    @UploadedFiles()
    files: {
      resolvedFile?: Express.Multer.File[];
      logoFile?: Express.Multer.File[];
    },
    @Body() project: ProjectCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ProjectCreateResponse> {
    const { isDryRun } = query;
    const { resolvedFile, logoFile } = files;
    const resolvedYaml = resolvedFile?.[0].buffer.toString();
    const logo = logoFile?.[0].buffer.toString("base64");
    const res = await this.projectService.create(
      project,
      isDryRun,
      resolvedYaml,
      logo,
    );
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async projectSearch(
    @Body() body: ProjectSearch,
  ): Promise<ProjectSearchResponse> {
    const res = await this.projectService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async projectGetById(
    @Param() params: { id: string },
    @Body() body: ProjectPopulateRequestBody,
  ): Promise<ProjectFindByIdResponse> {
    const { id: projectId } = params;
    const { populate } = body;
    const res = await this.projectService.getById(projectId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async projectGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: ProjectPopulateRequestBody,
  ): Promise<ProjectGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.projectService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async projectPatch(
    @Param() params: { id: string },
    @Body() project: ProjectPatch,
  ): Promise<ProjectPatchResponse> {
    const { id: projectId } = params;
    const res = await this.projectService.patch(projectId, project);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async projectUpdate(
    @Param() params: { id: string },
    @Body() project: ProjectUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ProjectUpdateResponse> {
    const { id: projectId } = params;
    const { isDryRun } = query;
    const res = await this.projectService.update(projectId, project, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async projectArchive(
    @Param() params: { id: string },
  ): Promise<ProjectArchiveResponse> {
    const { id: projectId } = params;
    const res = await this.projectService.archive(projectId);
    return ResultHandler.ok(res);
  }
}
