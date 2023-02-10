import {
  Balance,
  BalancePatch,
  BalanceSearch,
  BasicOperator,
  Envelop,
  EnvelopPatch,
  EnvelopType,
  Receipt,
  ReceiptCreate,
  ReceiptPatch,
  ReceiptPopulateField,
  ReceiptSearch,
  ReceiptUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { Transactionnal } from "../../decorators/transactionnal.decorator";
import { BalanceService } from "../balance/balance.service";
import { EnvelopService } from "../envelop/envelop.service";
import { ReceiptErrors } from "./receipt.errors";
import { ReceiptRepository } from "./receipt.repository";

@Injectable()
export class ReceiptService {
  constructor(
    private readonly receiptRepository: ReceiptRepository,
    private readonly envelopService: EnvelopService,
    private readonly balanceService: BalanceService,
  ) {}

  @Transactionnal("MongoReceipt")
  public async create(
    receipt: ReceiptCreate,
    isDryRun?: boolean,
  ): Promise<Receipt> {
    const res = await this.receiptRepository.create(receipt, isDryRun);

    const { envelopId, amount, userId } = receipt;

    // Get the Envelop
    const envelop = await this.envelopService.getById(envelopId);

    // Get the Diff Amount
    const { type } = envelop;
    const diff =
      type === EnvelopType.Income ? Math.abs(amount) : Math.abs(amount) * -1;

    await Promise.all([
      this.envelopPatch(envelop, diff),
      this.balancePatch(userId, diff),
    ]);

    return res;
  }

  public async createMany(receiptBulk: ReceiptCreate[]): Promise<Receipt[]> {
    const createPromises = receiptBulk.map((x) => {
      return this.create(x);
    });
    const res = await Promise.all(createPromises);
    return res;
  }

  public async search(
    searchParams: ReceiptSearch,
  ): Promise<YestPaginateResult<Receipt, never>> {
    const res = await this.receiptRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: ReceiptPopulateField[],
  ): Promise<Receipt[]> {
    const res = await this.receiptRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    receiptId: string,
    populate?: ReceiptPopulateField[],
  ): Promise<Receipt> {
    const res = await this.receiptRepository.getById(receiptId, populate);
    return res;
  }

  @Transactionnal("MongoReceipt")
  public async patch(
    receiptId: string,
    receipt: ReceiptPatch,
  ): Promise<Receipt> {
    const { amount } = receipt;
    const oldReceipt = await this.checkIfAlreadyArchived(receiptId);
    const { amount: oldAmount, userId, envelopId } = oldReceipt;

    if (amount !== undefined) {
      const diff = oldAmount - amount;
      if (diff) {
        const envelop = await this.envelopService.getById(envelopId);

        await Promise.all([
          this.envelopPatch(envelop, diff),
          this.balancePatch(userId, diff),
        ]);
      }
    }

    const res = await this.receiptRepository.patch(receiptId, receipt);
    return res;
  }

  @Transactionnal("MongoReceipt")
  public async update(
    receiptId: string,
    receipt: ReceiptUpdate,
    isDryRun?: boolean,
  ): Promise<Receipt> {
    const { amount } = receipt;
    const oldReceipt = await this.checkIfAlreadyArchived(receiptId);
    const { amount: oldAmount, userId, envelopId } = oldReceipt;

    const diff = oldAmount - amount;
    if (diff) {
      const envelop = await this.envelopService.getById(envelopId);

      await Promise.all([
        this.envelopPatch(envelop, diff),
        this.balancePatch(userId, diff),
      ]);
    }

    const res = await this.receiptRepository.update(
      receiptId,
      receipt,
      isDryRun,
    );
    return res;
  }

  @Transactionnal("MongoReceipt")
  public async archive(receiptId: string): Promise<Receipt> {
    const oldReceipt = await this.checkIfAlreadyArchived(receiptId);
    const { amount, userId, envelopId } = oldReceipt;

    const envelop = await this.envelopService.getById(envelopId);
    const diff =
      envelop.type === EnvelopType.Income
        ? Math.abs(amount) * -1
        : Math.abs(amount);

    await Promise.all([
      this.envelopPatch(envelop, diff),
      this.balancePatch(userId, diff),
    ]);

    const res = await this.receiptRepository.archive(receiptId);
    return res;
  }

  private async checkIfAlreadyArchived(receiptId: string): Promise<Receipt> {
    const receipt = await this.getById(receiptId);
    if (receipt.archived) {
      throw new ResultHandlerException(ReceiptErrors.alreadyArchived);
    }

    return receipt;
  }

  private async envelopPatch(
    envelop: Envelop,
    amount: number,
  ): Promise<Envelop> {
    const { balanceMonth, balanceTotal, id: envelopId } = envelop;
    const envelopPatch: EnvelopPatch = {
      balanceMonth: (balanceMonth || 0) + amount,
      balanceTotal: (balanceTotal || 0) + amount,
    };
    const envelopPatched = await this.envelopService.patch(
      envelopId,
      envelopPatch,
    );

    return envelopPatched;
  }

  private async balancePatch(userId: string, amount: number): Promise<Balance> {
    const balanceSearch: BalanceSearch = {
      pagination: {
        limit: 1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          userId: [
            {
              operator: BasicOperator.Equal,
              isExactMatching: true,
              values: [userId],
            },
          ],
        },
      ],
    };
    const balanceSearchApi = await this.balanceService.search(balanceSearch);
    if (
      balanceSearchApi.pagination.totalItems !== 1 ||
      balanceSearchApi.value.length !== 1
    ) {
      throw new ResultHandlerException(ReceiptErrors.balanceError);
    }
    const [balance] = balanceSearchApi.value;
    const { balanceMonth, balanceTotal, id: balanceId } = balance;
    const balancePatch: BalancePatch = {
      balanceMonth: (balanceMonth || 0) + amount,
      balanceTotal: (balanceTotal || 0) + amount,
    };
    const balancePatched = await this.balanceService.patch(
      balanceId,
      balancePatch,
    );

    return balancePatched;
  }
}
