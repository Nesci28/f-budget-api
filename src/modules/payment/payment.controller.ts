import {
  PaymentArchiveResponse,
  PaymentCreate,
  PaymentCreateResponse,
  PaymentFindByIdResponse,
  PaymentGetAllResponse,
  PaymentPatch,
  PaymentPatchResponse,
  PaymentPopulateRequestBody,
  PaymentSearch,
  PaymentSearchResponse,
  PaymentUpdate,
  PaymentUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard } from "@yest/security";

import { PaymentService } from "./payment.service";

@Controller()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtTokenGuard)
  public async paymentCreate(
    @Body() payment: PaymentCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<PaymentCreateResponse> {
    const { isDryRun } = query;
    const res = await this.paymentService.create(payment, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentSearch(
    @Body() body: PaymentSearch,
  ): Promise<PaymentSearchResponse> {
    const res = await this.paymentService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentGetById(
    @Param() params: { id: string },
    @Body() body: PaymentPopulateRequestBody,
  ): Promise<PaymentFindByIdResponse> {
    const { id: paymentId } = params;
    const { populate } = body;
    const res = await this.paymentService.getById(paymentId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: PaymentPopulateRequestBody,
  ): Promise<PaymentGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.paymentService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentPatch(
    @Param() params: { id: string },
    @Body() payment: PaymentPatch,
  ): Promise<PaymentPatchResponse> {
    const { id: paymentId } = params;
    const res = await this.paymentService.patch(paymentId, payment);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentUpdate(
    @Param() params: { id: string },
    @Body() payment: PaymentUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<PaymentUpdateResponse> {
    const { id: paymentId } = params;
    const { isDryRun } = query;
    const res = await this.paymentService.update(paymentId, payment, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard)
  public async paymentArchive(
    @Param() params: { id: string },
  ): Promise<PaymentArchiveResponse> {
    const { id: paymentId } = params;
    const res = await this.paymentService.archive(paymentId);
    return ResultHandler.ok(res);
  }
}
