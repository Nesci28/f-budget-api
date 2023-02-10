import {
  RenewArchiveResponse,
  RenewCreate,
  RenewCreateResponse,
  RenewFindByIdResponse,
  RenewGetAllResponse,
  RenewPatch,
  RenewPatchResponse,
  RenewPopulateRequestBody,
  RenewSearch,
  RenewSearchResponse,
  RenewUpdate,
  RenewUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";

import { RenewService } from "./renew.service";

@Controller()
export class RenewController {
  constructor(private readonly renewService: RenewService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewCreate(
    @Body() renew: RenewCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<RenewCreateResponse> {
    const { isDryRun } = query;
    const res = await this.renewService.create(renew, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewSearch(
    @Body() body: RenewSearch,
  ): Promise<RenewSearchResponse> {
    const res = await this.renewService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewGetById(
    @Param() params: { id: string },
    @Body() body: RenewPopulateRequestBody,
  ): Promise<RenewFindByIdResponse> {
    const { id: renewId } = params;
    const { populate } = body;
    const res = await this.renewService.getById(renewId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: RenewPopulateRequestBody,
  ): Promise<RenewGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.renewService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewPatch(
    @Param() params: { id: string },
    @Body() renew: RenewPatch,
  ): Promise<RenewPatchResponse> {
    const { id: renewId } = params;
    const res = await this.renewService.patch(renewId, renew);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewUpdate(
    @Param() params: { id: string },
    @Body() renew: RenewUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<RenewUpdateResponse> {
    const { id: renewId } = params;
    const { isDryRun } = query;
    const res = await this.renewService.update(renewId, renew, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async renewArchive(
    @Param() params: { id: string },
  ): Promise<RenewArchiveResponse> {
    const { id: renewId } = params;
    const res = await this.renewService.archive(renewId);
    return ResultHandler.ok(res);
  }
}
