import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import {
  EnvelopArchiveResponse,
  EnvelopCreate,
  EnvelopCreateResponse,
  EnvelopFindByIdResponse,
  EnvelopGetAllResponse,
  EnvelopPatch,
  EnvelopPatchResponse,
  EnvelopPopulateRequestBody,
  EnvelopSearch,
  EnvelopSearchResponse,
  EnvelopUpdate,
  EnvelopUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";

import { EnvelopService } from "./envelop.service";

@Controller()
export class EnvelopController {
  constructor(private readonly envelopService: EnvelopService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopCreate(
    @Body() envelop: EnvelopCreate,
    @Query() query: {
      isDryRun?: boolean;
    },
  ): Promise<EnvelopCreateResponse> {
    const { isDryRun } = query;
    const res = await this.envelopService.create(envelop, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopSearch(
    @Body() body: EnvelopSearch,
  ): Promise<EnvelopSearchResponse> {
    const res = await this.envelopService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopGetById(
    @Param() params: { id: string },
@Body() body: EnvelopPopulateRequestBody
  ): Promise<EnvelopFindByIdResponse> {
    const { id: envelopId } = params;
const { populate } = body;
    const res = await this.envelopService.getById(envelopId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopGetAll(
    @Query() query: { isArchived?: boolean },
@Body() body: EnvelopPopulateRequestBody
  ): Promise<EnvelopGetAllResponse> {
    const { isArchived } = query;
const { populate } = body;
    const res = await this.envelopService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopPatch(
    @Param() params: { id: string },
    @Body() envelop: EnvelopPatch,
  ): Promise<EnvelopPatchResponse> {
    const { id: envelopId } = params;
    const res = await this.envelopService.patch(envelopId, envelop);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopUpdate(
    @Param() params: { id: string },
    @Body() envelop: EnvelopUpdate,
    @Query() query: {
      isDryRun?: boolean;
    },
  ): Promise<EnvelopUpdateResponse> {
    const { id: envelopId } = params;
    const { isDryRun } = query;
    const res = await this.envelopService.update(envelopId, envelop, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async envelopArchive(
    @Param() params: { id: string },
  ): Promise<EnvelopArchiveResponse> {
    const { id: envelopId } = params;
    const res = await this.envelopService.archive(envelopId);
    return ResultHandler.ok(res);
  }
}
