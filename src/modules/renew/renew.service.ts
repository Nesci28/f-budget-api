import {
  Renew,
  RenewCreate,
  RenewPatch,
  RenewPopulateField,
  RenewSearch,
  RenewUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { RenewErrors } from "./renew.errors";
import { RenewRepository } from "./renew.repository";

@Injectable()
export class RenewService {
  constructor(private readonly renewRepository: RenewRepository) {}

  public async create(renew: RenewCreate, isDryRun?: boolean): Promise<Renew> {
    const res = await this.renewRepository.create(renew, isDryRun);
    return res;
  }

  public async createMany(renewBulk: RenewCreate[]): Promise<Renew[]> {
    const res = await this.renewRepository.createMany(renewBulk);
    return res;
  }

  public async search(
    searchParams: RenewSearch,
  ): Promise<YestPaginateResult<Renew, never>> {
    const res = await this.renewRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: RenewPopulateField[],
  ): Promise<Renew[]> {
    const res = await this.renewRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    renewId: string,
    populate?: RenewPopulateField[],
  ): Promise<Renew> {
    const res = await this.renewRepository.getById(renewId, populate);
    return res;
  }

  public async patch(renewId: string, renew: RenewPatch): Promise<Renew> {
    await this.checkIfAlreadyArchived(renewId);
    const res = await this.renewRepository.patch(renewId, renew);
    return res;
  }

  public async update(
    renewId: string,
    renew: RenewUpdate,
    isDryRun?: boolean,
  ): Promise<Renew> {
    await this.checkIfAlreadyArchived(renewId);
    const res = await this.renewRepository.update(renewId, renew, isDryRun);
    return res;
  }

  public async archive(renewId: string): Promise<Renew> {
    await this.checkIfAlreadyArchived(renewId);
    const res = await this.renewRepository.archive(renewId);
    return res;
  }

  private async checkIfAlreadyArchived(renewId: string): Promise<Renew> {
    const renew = await this.getById(renewId);
    if (renew.archived) {
      throw new ResultHandlerException(RenewErrors.alreadyArchived);
    }

    return renew;
  }
}
