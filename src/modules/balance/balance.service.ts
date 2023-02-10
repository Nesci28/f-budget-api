import {
  Balance,
  BalanceCreate,
  BalancePatch,
  BalancePopulateField,
  BalanceSearch,
  BalanceUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { BalanceErrors } from "./balance.errors";
import { BalanceRepository } from "./balance.repository";

@Injectable()
export class BalanceService {
  constructor(private readonly balanceRepository: BalanceRepository) {}

  public async create(
    balance: BalanceCreate,
    isDryRun?: boolean,
  ): Promise<Balance> {
    const res = await this.balanceRepository.create(balance, isDryRun);
    return res;
  }

  public async createMany(balanceBulk: BalanceCreate[]): Promise<Balance[]> {
    const res = await this.balanceRepository.createMany(balanceBulk);
    return res;
  }

  public async search(
    searchParams: BalanceSearch,
  ): Promise<YestPaginateResult<Balance, never>> {
    const res = await this.balanceRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: BalancePopulateField[],
  ): Promise<Balance[]> {
    const res = await this.balanceRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    balanceId: string,
    populate?: BalancePopulateField[],
  ): Promise<Balance> {
    const res = await this.balanceRepository.getById(balanceId, populate);
    return res;
  }

  public async patch(
    balanceId: string,
    balance: BalancePatch,
  ): Promise<Balance> {
    await this.checkIfAlreadyArchived(balanceId);
    const res = await this.balanceRepository.patch(balanceId, balance);
    return res;
  }

  public async update(
    balanceId: string,
    balance: BalanceUpdate,
    isDryRun?: boolean,
  ): Promise<Balance> {
    await this.checkIfAlreadyArchived(balanceId);
    const res = await this.balanceRepository.update(
      balanceId,
      balance,
      isDryRun,
    );
    return res;
  }

  public async archive(balanceId: string): Promise<Balance> {
    await this.checkIfAlreadyArchived(balanceId);
    const res = await this.balanceRepository.archive(balanceId);
    return res;
  }

  private async checkIfAlreadyArchived(balanceId: string): Promise<Balance> {
    const balance = await this.getById(balanceId);
    if (balance.archived) {
      throw new ResultHandlerException(BalanceErrors.alreadyArchived);
    }

    return balance;
  }
}
