import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Module,
  ModuleCreate,
  ModulePatch,
  ModulePopulateField,
  ModuleSearch,
  ModuleUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { ModuleErrors } from "./module.errors";
import { ModuleRepository } from "./module.repository";

@Injectable()
export class ModuleService {
  constructor(private readonly moduleRepository: ModuleRepository) {}

  public async create(
    module: ModuleCreate,
    isDryRun?: boolean,
  ): Promise<Module> {
    const res = await this.moduleRepository.create(module, isDryRun);
    return res;
  }

  public async createMany(moduleBulk: ModuleCreate[]): Promise<Module[]> {
    const res = await this.moduleRepository.createMany(moduleBulk);
    return res;
  }

  public async search(
    searchParams: ModuleSearch,
  ): Promise<YestPaginateResult<Module, never>> {
    const res = await this.moduleRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: ModulePopulateField[],
  ): Promise<Module[]> {
    const res = await this.moduleRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    moduleId: string,
    populate?: ModulePopulateField[],
  ): Promise<Module> {
    const res = await this.moduleRepository.getById(moduleId, populate);
    return res;
  }

  public async patch(moduleId: string, module: ModulePatch): Promise<Module> {
    await this.checkIfAlreadyArchived(moduleId);
    const res = await this.moduleRepository.patch(moduleId, module);
    return res;
  }

  public async update(
    moduleId: string,
    module: ModuleUpdate,
    isDryRun?: boolean,
  ): Promise<Module> {
    await this.checkIfAlreadyArchived(moduleId);
    const res = await this.moduleRepository.update(moduleId, module, isDryRun);
    return res;
  }

  public async archive(moduleId: string): Promise<Module> {
    await this.checkIfAlreadyArchived(moduleId);
    const res = await this.moduleRepository.archive(moduleId);
    return res;
  }

  private async checkIfAlreadyArchived(moduleId: string): Promise<Module> {
    const module = await this.getById(moduleId);
    if (module.archived) {
      throw new ResultHandlerException(ModuleErrors.alreadyArchived);
    }

    return module;
  }
}
