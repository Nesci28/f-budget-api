import {
  Picture,
  PictureCreate,
  PicturePatch,
  PicturePopulateField,
  PictureSearch,
  PictureUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable } from "@nestjs/common";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";

import { PictureErrors } from "./picture.errors";
import { PictureRepository } from "./picture.repository";

@Injectable()
export class PictureService {
  constructor(private readonly pictureRepository: PictureRepository) {}

  public async create(
    picture: PictureCreate,
    isDryRun?: boolean,
  ): Promise<Picture> {
    const res = await this.pictureRepository.create(picture, isDryRun);
    return res;
  }

  public async createMany(pictureBulk: PictureCreate[]): Promise<Picture[]> {
    const res = await this.pictureRepository.createMany(pictureBulk);
    return res;
  }

  public async search(
    searchParams: PictureSearch,
  ): Promise<YestPaginateResult<Picture, never>> {
    const res = await this.pictureRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: PicturePopulateField[],
  ): Promise<Picture[]> {
    const res = await this.pictureRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    pictureId: string,
    populate?: PicturePopulateField[],
  ): Promise<Picture> {
    const res = await this.pictureRepository.getById(pictureId, populate);
    return res;
  }

  public async patch(
    pictureId: string,
    picture: PicturePatch,
  ): Promise<Picture> {
    await this.checkIfAlreadyArchived(pictureId);
    const res = await this.pictureRepository.patch(pictureId, picture);
    return res;
  }

  public async update(
    pictureId: string,
    picture: PictureUpdate,
    isDryRun?: boolean,
  ): Promise<Picture> {
    await this.checkIfAlreadyArchived(pictureId);
    const res = await this.pictureRepository.update(
      pictureId,
      picture,
      isDryRun,
    );
    return res;
  }

  public async archive(pictureId: string): Promise<Picture> {
    await this.checkIfAlreadyArchived(pictureId);
    const res = await this.pictureRepository.archive(pictureId);
    return res;
  }

  private async checkIfAlreadyArchived(pictureId: string): Promise<Picture> {
    const picture = await this.getById(pictureId);
    if (picture.archived) {
      throw new ResultHandlerException(PictureErrors.alreadyArchived);
    }

    return picture;
  }
}
