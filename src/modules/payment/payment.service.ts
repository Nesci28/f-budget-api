import {
  Payment,
  PaymentCreate,
  PaymentPatch,
  PaymentPopulateField,
  PaymentSearch,
  PaymentUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { PaymentErrors } from "./payment.errors";
import { PaymentRepository } from "./payment.repository";

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  public async create(
    payment: PaymentCreate,
    isDryRun?: boolean,
  ): Promise<Payment> {
    const res = await this.paymentRepository.create(payment, isDryRun);
    return res;
  }

  public async createMany(paymentBulk: PaymentCreate[]): Promise<Payment[]> {
    const res = await this.paymentRepository.createMany(paymentBulk);
    return res;
  }

  public async search(
    searchParams: PaymentSearch,
  ): Promise<YestPaginateResult<Payment, never>> {
    const res = await this.paymentRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: PaymentPopulateField[],
  ): Promise<Payment[]> {
    const res = await this.paymentRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    paymentId: string,
    populate?: PaymentPopulateField[],
  ): Promise<Payment> {
    const res = await this.paymentRepository.getById(paymentId, populate);
    return res;
  }

  public async patch(
    paymentId: string,
    payment: PaymentPatch,
  ): Promise<Payment> {
    await this.checkIfAlreadyArchived(paymentId);
    const res = await this.paymentRepository.patch(paymentId, payment);
    return res;
  }

  public async update(
    paymentId: string,
    payment: PaymentUpdate,
    isDryRun?: boolean,
  ): Promise<Payment> {
    await this.checkIfAlreadyArchived(paymentId);
    const res = await this.paymentRepository.update(
      paymentId,
      payment,
      isDryRun,
    );
    return res;
  }

  public async archive(paymentId: string): Promise<Payment> {
    await this.checkIfAlreadyArchived(paymentId);
    const res = await this.paymentRepository.archive(paymentId);
    return res;
  }

  private async checkIfAlreadyArchived(paymentId: string): Promise<Payment> {
    const payment = await this.getById(paymentId);
    if (payment.archived) {
      throw new ResultHandlerException(PaymentErrors.alreadyArchived);
    }

    return payment;
  }
}
