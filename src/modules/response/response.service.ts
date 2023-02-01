import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  Response,
  ResponseCreate,
  ResponsePatch,
  ResponsePopulateField,
  ResponseSearch,
  ResponseUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { ResponseErrors } from "./response.errors";
import { ResponseRepository } from "./response.repository";

@Injectable()
export class ResponseService {
  constructor(private readonly responseRepository: ResponseRepository) {}

  public async create(
    response: ResponseCreate,
    isDryRun?: boolean,
  ): Promise<Response> {
    const res = await this.responseRepository.create(response, isDryRun);
    return res;
  }

  public async createMany(responseBulk: ResponseCreate[]): Promise<Response[]> {
    const res = await this.responseRepository.createMany(responseBulk);
    return res;
  }

  public async search(
    searchParams: ResponseSearch,
  ): Promise<YestPaginateResult<Response, never>> {
    const res = await this.responseRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: ResponsePopulateField[],
  ): Promise<Response[]> {
    const res = await this.responseRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    responseId: string,
    populate?: ResponsePopulateField[],
  ): Promise<Response> {
    const res = await this.responseRepository.getById(responseId, populate);
    return res;
  }

  public async patch(
    responseId: string,
    response: ResponsePatch,
  ): Promise<Response> {
    await this.checkIfAlreadyArchived(responseId);
    const res = await this.responseRepository.patch(responseId, response);
    return res;
  }

  public async update(
    responseId: string,
    response: ResponseUpdate,
    isDryRun?: boolean,
  ): Promise<Response> {
    await this.checkIfAlreadyArchived(responseId);
    const res = await this.responseRepository.update(
      responseId,
      response,
      isDryRun,
    );
    return res;
  }

  public async archive(responseId: string): Promise<Response> {
    await this.checkIfAlreadyArchived(responseId);
    const res = await this.responseRepository.archive(responseId);
    return res;
  }

  private async checkIfAlreadyArchived(responseId: string): Promise<Response> {
    const response = await this.getById(responseId);
    if (response.archived) {
      throw new ResultHandlerException(ResponseErrors.alreadyArchived);
    }

    return response;
  }
}
