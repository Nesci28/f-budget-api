import {
  ReceiptArchiveResponse,
  ReceiptCreate,
  ReceiptCreateResponse,
  ReceiptFindByIdResponse,
  ReceiptGetAllResponse,
  ReceiptPatch,
  ReceiptPatchResponse,
  ReceiptPopulateRequestBody,
  ReceiptSearch,
  ReceiptSearchResponse,
  ReceiptUpdate,
  ReceiptUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";

import { ReceiptService } from "./receipt.service";

@Controller()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @UseGuards(JwtTokenGuard)
  public async receiptCreate(
    @Body() receipt: ReceiptCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ReceiptCreateResponse> {
    const { isDryRun } = query;
    const res = await this.receiptService.create(receipt, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptSearch(
    @Body() body: ReceiptSearch,
  ): Promise<ReceiptSearchResponse> {
    const res = await this.receiptService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptGetById(
    @Param() params: { id: string },
    @Body() body: ReceiptPopulateRequestBody,
  ): Promise<ReceiptFindByIdResponse> {
    const { id: receiptId } = params;
    const { populate } = body;
    const res = await this.receiptService.getById(receiptId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: ReceiptPopulateRequestBody,
  ): Promise<ReceiptGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.receiptService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptPatch(
    @Param() params: { id: string },
    @Body() receipt: ReceiptPatch,
  ): Promise<ReceiptPatchResponse> {
    const { id: receiptId } = params;
    const res = await this.receiptService.patch(receiptId, receipt);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptUpdate(
    @Param() params: { id: string },
    @Body() receipt: ReceiptUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<ReceiptUpdateResponse> {
    const { id: receiptId } = params;
    const { isDryRun } = query;
    const res = await this.receiptService.update(receiptId, receipt, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async receiptArchive(
    @Param() params: { id: string },
  ): Promise<ReceiptArchiveResponse> {
    const { id: receiptId } = params;
    const res = await this.receiptService.archive(receiptId);
    return ResultHandler.ok(res);
  }
}
