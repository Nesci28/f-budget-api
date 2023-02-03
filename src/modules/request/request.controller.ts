import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";
import {
  RequestArchiveResponse,
  RequestCreate,
  RequestCreateResponse,
  RequestFindByIdResponse,
  RequestGetAllResponse,
  RequestPatch,
  RequestPatchResponse,
  RequestPopulateRequestBody,
  RequestSearch,
  RequestSearchResponse,
  RequestUpdate,
  RequestUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";

import { IpsGuard } from "../../guards/ip.guard";
import { RequestService } from "./request.service";

@Controller()
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @UseGuards(IpsGuard)
  public async requestCreate(
    @Body() request: RequestCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<RequestCreateResponse> {
    const { isDryRun } = query;
    const res = this.requestService.create(request, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async requestSearch(
    @Body() body: RequestSearch,
  ): Promise<RequestSearchResponse> {
    const res = await this.requestService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async requestGetById(
    @Param() params: { id: string },
    @Body() body: RequestPopulateRequestBody,
  ): Promise<RequestFindByIdResponse> {
    const { id: requestId } = params;
    const { populate } = body;
    const res = await this.requestService.getById(requestId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async requestGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: RequestPopulateRequestBody,
  ): Promise<RequestGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.requestService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(IpsGuard)
  public async requestPatch(
    @Param() params: { id: string },
    @Body() request: RequestPatch,
  ): Promise<RequestPatchResponse> {
    const { id: requestId } = params;
    const res = await this.requestService.patch(requestId, request);
    return ResultHandler.ok(res);
  }

  @UseGuards(IpsGuard)
  public async requestUpdate(
    @Param() params: { id: string },
    @Body() request: RequestUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<RequestUpdateResponse> {
    const { id: requestId } = params;
    const { isDryRun } = query;
    const res = await this.requestService.update(requestId, request, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async requestArchive(
    @Param() params: { id: string },
  ): Promise<RequestArchiveResponse> {
    const { id: requestId } = params;
    const res = await this.requestService.archive(requestId);
    return ResultHandler.ok(res);
  }
}
