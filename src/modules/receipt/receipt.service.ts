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

    const [envelopPatched, balancePatched] = await Promise.all([
      this.envelopPatch(envelop, diff),
      this.balancePatch(userId, diff),
    ]);

    const {
      incomeMonth: envelopIncomeMonth,
      incomeTotal: envelopIncomeTotal,
      outcomeMonth: envelopOutcomeMonth,
      outcomeTotal: envelopOutcomeTotal,
    } = envelopPatched;
    const { incomeMonth, incomeTotal, outcomeMonth, outcomeTotal } =
      balancePatched;
    const receiptPatch: ReceiptPatch = {
      envelopIncomeMonth,
      envelopIncomeTotal,
      envelopOutcomeMonth,
      envelopOutcomeTotal,
      incomeMonth,
      incomeTotal,
      outcomeMonth,
      outcomeTotal,
    };
    const receiptPatched = await this.patch(res.id, receiptPatch);

    return receiptPatched;
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
        const [envelop] = await Promise.all([
          this.envelopService.getById(envelopId),
          this.getBalanceByUserId(userId),
        ]);

        const [envelopPatched, balancePatched] = await Promise.all([
          this.envelopPatch(envelop, diff),
          this.balancePatch(userId, diff),
        ]);

        const {
          incomeMonth: envelopIncomeMonth,
          incomeTotal: envelopIncomeTotal,
          outcomeMonth: envelopOutcomeMonth,
          outcomeTotal: envelopOutcomeTotal,
        } = envelopPatched;
        const { incomeMonth, incomeTotal, outcomeMonth, outcomeTotal } =
          balancePatched;

        // eslint-disable-next-line no-param-reassign
        receipt.envelopIncomeMonth = envelopIncomeMonth || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.envelopIncomeTotal = envelopIncomeTotal || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.envelopOutcomeMonth = envelopOutcomeMonth || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.envelopOutcomeTotal = envelopOutcomeTotal || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.incomeMonth = incomeMonth || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.incomeTotal = incomeTotal || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.outcomeMonth = outcomeMonth || 0;
        // eslint-disable-next-line no-param-reassign
        receipt.outcomeTotal = outcomeTotal || 0;
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
      const [envelop] = await Promise.all([
        this.envelopService.getById(envelopId),
        this.getBalanceByUserId(userId),
      ]);

      const [envelopPatched, balancePatched] = await Promise.all([
        this.envelopPatch(envelop, diff),
        this.balancePatch(userId, diff),
      ]);

      const {
        incomeMonth: envelopIncomeMonth,
        incomeTotal: envelopIncomeTotal,
        outcomeMonth: envelopOutcomeMonth,
        outcomeTotal: envelopOutcomeTotal,
      } = envelopPatched;
      const { incomeMonth, incomeTotal, outcomeMonth, outcomeTotal } =
        balancePatched;

      // eslint-disable-next-line no-param-reassign
      receipt.envelopIncomeMonth = envelopIncomeMonth || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.envelopIncomeTotal = envelopIncomeTotal || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.envelopOutcomeMonth = envelopOutcomeMonth || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.envelopOutcomeTotal = envelopOutcomeTotal || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.incomeMonth = incomeMonth || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.incomeTotal = incomeTotal || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.outcomeMonth = outcomeMonth || 0;
      // eslint-disable-next-line no-param-reassign
      receipt.outcomeTotal = outcomeTotal || 0;
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
    const {
      incomeMonth,
      incomeTotal,
      outcomeMonth,
      outcomeTotal,
      id: envelopId,
    } = envelop;

    const envelopPatch: EnvelopPatch = {};

    if (amount > 0) {
      envelopPatch.incomeMonth = (incomeMonth || 0) + amount;
      envelopPatch.incomeTotal = (incomeTotal || 0) + amount;
    }

    if (amount < 0) {
      envelopPatch.outcomeMonth = (outcomeMonth || 0) + Math.abs(amount);
      envelopPatch.outcomeTotal = (outcomeTotal || 0) + Math.abs(amount);
    }

    const envelopPatched = await this.envelopService.patch(
      envelopId,
      envelopPatch,
    );

    return envelopPatched;
  }

  private async balancePatch(userId: string, amount: number): Promise<Balance> {
    const balance = await this.getBalanceByUserId(userId);
    const {
      incomeMonth,
      incomeTotal,
      outcomeMonth,
      outcomeTotal,
      id: balanceId,
    } = balance;

    const newIncomeMonth =
      amount > 0 ? (incomeMonth || 0) + amount : incomeMonth || 0;
    const newIncomeTotal =
      amount > 0 ? (incomeTotal || 0) + amount : incomeTotal || 0;
    const newOutcomeMonth =
      amount < 0 ? (outcomeMonth || 0) + Math.abs(amount) : outcomeMonth || 0;
    const newOutcomeTotal =
      amount < 0 ? (outcomeTotal || 0) + Math.abs(amount) : outcomeTotal || 0;

    const balancePatch: BalancePatch = {
      incomeMonth: newIncomeMonth,
      incomeTotal: newIncomeTotal,
      outcomeMonth: newOutcomeMonth,
      outcomeTotal: newOutcomeTotal,
    };
    const balancePatched = await this.balanceService.patch(
      balanceId,
      balancePatch,
    );

    return balancePatched;
  }

  private async getBalanceByUserId(userId: string): Promise<Balance> {
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

    return balance;
  }
}
