import {
  BalanceArchiveResponse,
  BalanceCreate,
  BalanceCreateResponse,
  BalanceFindByIdResponse,
  BalanceGetAllResponse,
  BalancePatch,
  BalancePatchResponse,
  BalancePopulateRequestBody,
  BalanceSearch,
  BalanceSearchResponse,
  BalanceUpdate,
  BalanceUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";

import { BalanceService } from "./balance.service";

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @UseGuards(JwtTokenGuard)
  public async balanceCreate(
    @Body() balance: BalanceCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<BalanceCreateResponse> {
    const { isDryRun } = query;
    const res = await this.balanceService.create(balance, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async balanceSearch(
    @Body() body: BalanceSearch,
  ): Promise<BalanceSearchResponse> {
    const res = await this.balanceService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async balanceGetById(
    @Param() params: { id: string },
    @Body() body: BalancePopulateRequestBody,
  ): Promise<BalanceFindByIdResponse> {
    const { id: balanceId } = params;
    const { populate } = body;
    const res = await this.balanceService.getById(balanceId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async balanceGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: BalancePopulateRequestBody,
  ): Promise<BalanceGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.balanceService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async balancePatch(
    @Param() params: { id: string },
    @Body() balance: BalancePatch,
  ): Promise<BalancePatchResponse> {
    const { id: balanceId } = params;
    const res = await this.balanceService.patch(balanceId, balance);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async balanceUpdate(
    @Param() params: { id: string },
    @Body() balance: BalanceUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<BalanceUpdateResponse> {
    const { id: balanceId } = params;
    const { isDryRun } = query;
    const res = await this.balanceService.update(balanceId, balance, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async balanceArchive(
    @Param() params: { id: string },
  ): Promise<BalanceArchiveResponse> {
    const { id: balanceId } = params;
    const res = await this.balanceService.archive(balanceId);
    return ResultHandler.ok(res);
  }
}
