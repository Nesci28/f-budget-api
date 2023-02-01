import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Request,
  RequestCreate,
  RequestPatch,
  RequestPopulateField,
  RequestSearch,
  RequestUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { RequestErrors } from "./request.errors";
import { RequestRepository } from "./request.repository";

@Injectable()
export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  public async create(
    request: RequestCreate,
    isDryRun?: boolean,
  ): Promise<Request> {
    const res = await this.requestRepository.create(request, isDryRun);
    return res;
  }

  public async createMany(requestBulk: RequestCreate[]): Promise<Request[]> {
    const res = await this.requestRepository.createMany(requestBulk);
    return res;
  }

  public async search(
    searchParams: RequestSearch,
  ): Promise<YestPaginateResult<Request, never>> {
    const res = await this.requestRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: RequestPopulateField[],
  ): Promise<Request[]> {
    const res = await this.requestRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    requestId: string,
    populate?: RequestPopulateField[],
  ): Promise<Request> {
    const res = await this.requestRepository.getById(requestId, populate);
    return res;
  }

  public async patch(
    requestId: string,
    request: RequestPatch,
  ): Promise<Request> {
    await this.checkIfAlreadyArchived(requestId);
    const res = await this.requestRepository.patch(requestId, request);
    return res;
  }

  public async update(
    requestId: string,
    request: RequestUpdate,
    isDryRun?: boolean,
  ): Promise<Request> {
    await this.checkIfAlreadyArchived(requestId);
    const res = await this.requestRepository.update(
      requestId,
      request,
      isDryRun,
    );
    return res;
  }

  public async archive(requestId: string): Promise<Request> {
    await this.checkIfAlreadyArchived(requestId);
    const res = await this.requestRepository.archive(requestId);
    return res;
  }

  private async checkIfAlreadyArchived(requestId: string): Promise<Request> {
    const request = await this.getById(requestId);
    if (request.archived) {
      throw new ResultHandlerException(RequestErrors.alreadyArchived);
    }

    return request;
  }
}
