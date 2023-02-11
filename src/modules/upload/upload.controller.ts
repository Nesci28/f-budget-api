import {
  UploadArchiveResponse,
  UploadCreate,
  UploadCreateResponse,
  UploadFindByIdResponse,
  UploadGetAllResponse,
  UploadPatch,
  UploadPatchResponse,
  UploadPopulateRequestBody,
  UploadSearch,
  UploadSearchResponse,
  UploadUpdate,
  UploadUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";

import { UploadService } from "./upload.service";

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtTokenGuard)
  public async uploadCreate(
    @Body() upload: UploadCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UploadCreateResponse> {
    const { isDryRun } = query;
    const res = await this.uploadService.create(upload, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadSearch(
    @Body() body: UploadSearch,
  ): Promise<UploadSearchResponse> {
    const res = await this.uploadService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadGetById(
    @Param() params: { id: string },
    @Body() body: UploadPopulateRequestBody,
  ): Promise<UploadFindByIdResponse> {
    const { id: uploadId } = params;
    const { populate } = body;
    const res = await this.uploadService.getById(uploadId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: UploadPopulateRequestBody,
  ): Promise<UploadGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.uploadService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadPatch(
    @Param() params: { id: string },
    @Body() upload: UploadPatch,
  ): Promise<UploadPatchResponse> {
    const { id: uploadId } = params;
    const res = await this.uploadService.patch(uploadId, upload);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadUpdate(
    @Param() params: { id: string },
    @Body() upload: UploadUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UploadUpdateResponse> {
    const { id: uploadId } = params;
    const { isDryRun } = query;
    const res = await this.uploadService.update(uploadId, upload, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async uploadArchive(
    @Param() params: { id: string },
  ): Promise<UploadArchiveResponse> {
    const { id: uploadId } = params;
    const res = await this.uploadService.archive(uploadId);
    return ResultHandler.ok(res);
  }
}
