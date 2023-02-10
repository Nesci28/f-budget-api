import {
  Upload,
  UploadCreate,
  UploadPatch,
  UploadPopulateField,
  UploadSearch,
  UploadUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { UploadErrors } from "./upload.errors";
import { UploadRepository } from "./upload.repository";

@Injectable()
export class UploadService {
  constructor(private readonly uploadRepository: UploadRepository) {}

  public async create(
    upload: UploadCreate,
    isDryRun?: boolean,
  ): Promise<Upload> {
    const res = await this.uploadRepository.create(upload, isDryRun);
    return res;
  }

  public async createMany(uploadBulk: UploadCreate[]): Promise<Upload[]> {
    const res = await this.uploadRepository.createMany(uploadBulk);
    return res;
  }

  public async search(
    searchParams: UploadSearch,
  ): Promise<YestPaginateResult<Upload, never>> {
    const res = await this.uploadRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: UploadPopulateField[],
  ): Promise<Upload[]> {
    const res = await this.uploadRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    uploadId: string,
    populate?: UploadPopulateField[],
  ): Promise<Upload> {
    const res = await this.uploadRepository.getById(uploadId, populate);
    return res;
  }

  public async patch(uploadId: string, upload: UploadPatch): Promise<Upload> {
    await this.checkIfAlreadyArchived(uploadId);
    const res = await this.uploadRepository.patch(uploadId, upload);
    return res;
  }

  public async update(
    uploadId: string,
    upload: UploadUpdate,
    isDryRun?: boolean,
  ): Promise<Upload> {
    await this.checkIfAlreadyArchived(uploadId);
    const res = await this.uploadRepository.update(uploadId, upload, isDryRun);
    return res;
  }

  public async archive(uploadId: string): Promise<Upload> {
    await this.checkIfAlreadyArchived(uploadId);
    const res = await this.uploadRepository.archive(uploadId);
    return res;
  }

  private async checkIfAlreadyArchived(uploadId: string): Promise<Upload> {
    const upload = await this.getById(uploadId);
    if (upload.archived) {
      throw new ResultHandlerException(UploadErrors.alreadyArchived);
    }

    return upload;
  }
}
