import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";
import {
  ResponseArchiveResponse,
  ResponseCreate,
  ResponseCreateResponse,
  ResponseFindByIdResponse,
  ResponseGetAllResponse,
  ResponsePatch,
  ResponsePatchResponse,
  ResponsePopulateRequestBody,
  ResponseSearch,
  ResponseSearchResponse,
  ResponseUpdate,
  ResponseUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";

import { IpsGuard } from "../../guards/ip.guard";
import { ResponseService } from "./response.service";

@Controller()
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @UseGuards(IpsGuard)
  public async responseCreate(
    @Body() response: ResponseCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ResponseCreateResponse> {
    const { isDryRun } = query;
    const res = this.responseService.create(response, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async responseSearch(
    @Body() body: ResponseSearch,
  ): Promise<ResponseSearchResponse> {
    const res = await this.responseService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async responseGetById(
    @Param() params: { id: string },
    @Body() body: ResponsePopulateRequestBody,
  ): Promise<ResponseFindByIdResponse> {
    const { id: responseId } = params;
    const { populate } = body;
    const res = await this.responseService.getById(responseId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async responseGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: ResponsePopulateRequestBody,
  ): Promise<ResponseGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.responseService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(IpsGuard)
  public async responsePatch(
    @Param() params: { id: string },
    @Body() response: ResponsePatch,
  ): Promise<ResponsePatchResponse> {
    const { id: responseId } = params;
    const res = await this.responseService.patch(responseId, response);
    return ResultHandler.ok(res);
  }

  @UseGuards(IpsGuard)
  public async responseUpdate(
    @Param() params: { id: string },
    @Body() response: ResponseUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ResponseUpdateResponse> {
    const { id: responseId } = params;
    const { isDryRun } = query;
    const res = await this.responseService.update(
      responseId,
      response,
      isDryRun,
    );
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async responseArchive(
    @Param() params: { id: string },
  ): Promise<ResponseArchiveResponse> {
    const { id: responseId } = params;
    const res = await this.responseService.archive(responseId);
    return ResultHandler.ok(res);
  }
}
