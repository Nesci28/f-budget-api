import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Endpoint,
  EndpointCreate,
  EndpointPatch,
  EndpointSearch,
  EndpointUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { EndpointErrors } from "./endpoint.errors";
import { EndpointRepository } from "./endpoint.repository";

@Injectable()
export class EndpointService {
  constructor(private readonly endpointRepository: EndpointRepository) {}

  public async create(
    endpoint: EndpointCreate,
    isDryRun?: boolean,
  ): Promise<Endpoint> {
    const res = await this.endpointRepository.create(endpoint, isDryRun);
    return res;
  }

  public async createMany(endpointBulk: EndpointCreate[]): Promise<Endpoint[]> {
    const res = await this.endpointRepository.createMany(endpointBulk);
    return res;
  }

  public async search(
    searchParams: EndpointSearch,
  ): Promise<YestPaginateResult<Endpoint, never>> {
    const res = await this.endpointRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: never,
  ): Promise<Endpoint[]> {
    const res = await this.endpointRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    endpointId: string,
    populate?: never,
  ): Promise<Endpoint> {
    const res = await this.endpointRepository.getById(endpointId, populate);
    return res;
  }

  public async patch(
    endpointId: string,
    endpoint: EndpointPatch,
  ): Promise<Endpoint> {
    await this.checkIfAlreadyArchived(endpointId);
    const res = await this.endpointRepository.patch(endpointId, endpoint);
    return res;
  }

  public async update(
    endpointId: string,
    endpoint: EndpointUpdate,
    isDryRun?: boolean,
  ): Promise<Endpoint> {
    await this.checkIfAlreadyArchived(endpointId);
    const res = await this.endpointRepository.update(
      endpointId,
      endpoint,
      isDryRun,
    );
    return res;
  }

  public async archive(endpointId: string): Promise<Endpoint> {
    await this.checkIfAlreadyArchived(endpointId);
    const res = await this.endpointRepository.archive(endpointId);
    return res;
  }

  private async checkIfAlreadyArchived(endpointId: string): Promise<Endpoint> {
    const endpoint = await this.getById(endpointId);
    if (endpoint.archived) {
      throw new ResultHandlerException(EndpointErrors.alreadyArchived);
    }

    return endpoint;
  }
}
