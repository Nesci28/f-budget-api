import { InjectQueue } from "@nestjs/bull";
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
import { Queue } from "bull";
import mongoose from "mongoose";

import { RequestErrors } from "./request.errors";
import { RequestRepository } from "./request.repository";

@Injectable()
export class RequestService {
  constructor(
    @InjectQueue("request") private requestQueue: Queue,
    private readonly requestRepository: RequestRepository,
  ) {}

  public create(request: RequestCreate, isDryRun?: boolean): Request {
    const requestId = new mongoose.Types.ObjectId().toHexString();
    const requestWithId = {
      ...request,
      id: requestId,
    };

    void this.requestQueue.add(
      { request: requestWithId, isDryRun },
      { removeOnComplete: true },
    );

    const date = new Date();
    const requestModel: Request = {
      ...requestWithId,
      endpointId: new mongoose.Types.ObjectId().toHexString(),
      createdAt: date,
      updatedAt: date,
      archived: false,
    };
    return requestModel;
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
