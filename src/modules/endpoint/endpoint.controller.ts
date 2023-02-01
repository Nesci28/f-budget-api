import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";
import {
  EndpointArchiveResponse,
  EndpointCreate,
  EndpointCreateResponse,
  EndpointFindByIdResponse,
  EndpointGetAllResponse,
  EndpointPatch,
  EndpointPatchResponse,
  EndpointSearch,
  EndpointSearchResponse,
  EndpointUpdate,
  EndpointUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";

import { EndpointService } from "./endpoint.service";

@Controller()
export class EndpointController {
  constructor(private readonly endpointService: EndpointService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointCreate(
    @Body() endpoint: EndpointCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<EndpointCreateResponse> {
    const { isDryRun } = query;
    const res = await this.endpointService.create(endpoint, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointSearch(
    @Body() body: EndpointSearch,
  ): Promise<EndpointSearchResponse> {
    const res = await this.endpointService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointGetById(
    @Param() params: { id: string },
  ): Promise<EndpointFindByIdResponse> {
    const { id: endpointId } = params;
    const res = await this.endpointService.getById(endpointId);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointGetAll(
    @Query() query: { isArchived?: boolean },
  ): Promise<EndpointGetAllResponse> {
    const { isArchived } = query;
    const res = await this.endpointService.getAll(isArchived);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointPatch(
    @Param() params: { id: string },
    @Body() endpoint: EndpointPatch,
  ): Promise<EndpointPatchResponse> {
    const { id: endpointId } = params;
    const res = await this.endpointService.patch(endpointId, endpoint);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointUpdate(
    @Param() params: { id: string },
    @Body() endpoint: EndpointUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<EndpointUpdateResponse> {
    const { id: endpointId } = params;
    const { isDryRun } = query;
    const res = await this.endpointService.update(
      endpointId,
      endpoint,
      isDryRun,
    );
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async endpointArchive(
    @Param() params: { id: string },
  ): Promise<EndpointArchiveResponse> {
    const { id: endpointId } = params;
    const res = await this.endpointService.archive(endpointId);
    return ResultHandler.ok(res);
  }
}
