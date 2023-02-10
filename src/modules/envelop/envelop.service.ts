import { Injectable } from "@nestjs/common";
import {
  Envelop,
  EnvelopCreate,
  EnvelopPatch,
  EnvelopPopulateField,
  EnvelopSearch,
  EnvelopUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { EnvelopErrors } from "./envelop.errors";
import { EnvelopRepository } from "./envelop.repository";

@Injectable()
export class EnvelopService {
  constructor(
    private readonly envelopRepository: EnvelopRepository,
  ) {}

  public async create(
    envelop: EnvelopCreate,
    isDryRun?: boolean,
  ): Promise<Envelop> {
    const res = await this.envelopRepository.create(envelop, isDryRun);
    return res;
  }

  public async createMany(
    envelopBulk: EnvelopCreate[],
  ): Promise<Envelop[]> {
    const res = await this.envelopRepository.createMany(envelopBulk);
    return res;
  }

  public async search(
    searchParams: EnvelopSearch,
  ): Promise<YestPaginateResult<Envelop>> {
    const res = await this.envelopRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: EnvelopPopulateField[],
  ): Promise<Envelop[]> {
    const res = await this.envelopRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    envelopId: string,
    populate?: EnvelopPopulateField[],
  ): Promise<Envelop> {
    const res = await this.envelopRepository.getById(envelopId, populate);
    return res;
  }

  public async patch(
    envelopId: string,
    envelop: EnvelopPatch,
  ): Promise<Envelop> {
    await this.checkIfAlreadyArchived(envelopId);
    const res = await this.envelopRepository.patch(envelopId, envelop);
    return res;
  }

  public async update(
    envelopId: string,
    envelop: EnvelopUpdate,
    isDryRun?: boolean,
  ): Promise<Envelop> {
    await this.checkIfAlreadyArchived(envelopId);
    const res = await this.envelopRepository.update(envelopId, envelop, isDryRun);
    return res;
  }

  public async archive(envelopId: string): Promise<Envelop> {
    await this.checkIfAlreadyArchived(envelopId);
    const res = await this.envelopRepository.archive(envelopId);
    return res;
  }

  private async checkIfAlreadyArchived(envelopId: string): Promise<Envelop> {
    const envelop = await this.getById(envelopId);
    if (envelop.archived) {
      throw new ResultHandlerException(EnvelopErrors.alreadyArchived);
    }

    return envelop;
  }
}
