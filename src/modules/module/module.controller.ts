import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";
import {
  ModuleArchiveResponse,
  ModuleCreate,
  ModuleCreateResponse,
  ModuleFindByIdResponse,
  ModuleGetAllResponse,
  ModulePatch,
  ModulePatchResponse,
  ModulePopulateRequestBody,
  ModuleSearch,
  ModuleSearchResponse,
  ModuleUpdate,
  ModuleUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";

import { ModuleService } from "./module.service";

@Controller()
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  @UseGuards(JwtTokenGuard)
  public async moduleCreate(
    @Body() module: ModuleCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ModuleCreateResponse> {
    const { isDryRun } = query;
    const res = await this.moduleService.create(module, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async moduleSearch(
    @Body() body: ModuleSearch,
  ): Promise<ModuleSearchResponse> {
    const res = await this.moduleService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async moduleGetById(
    @Param() params: { id: string },
    @Body() body: ModulePopulateRequestBody,
  ): Promise<ModuleFindByIdResponse> {
    const { id: moduleId } = params;
    const { populate } = body;
    const res = await this.moduleService.getById(moduleId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async moduleGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: ModulePopulateRequestBody,
  ): Promise<ModuleGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.moduleService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async modulePatch(
    @Param() params: { id: string },
    @Body() module: ModulePatch,
  ): Promise<ModulePatchResponse> {
    const { id: moduleId } = params;
    const res = await this.moduleService.patch(moduleId, module);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async moduleUpdate(
    @Param() params: { id: string },
    @Body() module: ModuleUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ModuleUpdateResponse> {
    const { id: moduleId } = params;
    const { isDryRun } = query;
    const res = await this.moduleService.update(moduleId, module, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async moduleArchive(
    @Param() params: { id: string },
  ): Promise<ModuleArchiveResponse> {
    const { id: moduleId } = params;
    const res = await this.moduleService.archive(moduleId);
    return ResultHandler.ok(res);
  }
}
