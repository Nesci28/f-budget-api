import {
  PictureArchiveResponse,
  PictureCreate,
  PictureCreateResponse,
  PictureFindByIdResponse,
  PictureGetAllResponse,
  PicturePatch,
  PicturePatchResponse,
  PicturePopulateRequestBody,
  PictureSearch,
  PictureSearchResponse,
  PictureUpdate,
  PictureUpdateResponse,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";

import { PictureService } from "./picture.service";

@Controller()
export class PictureController {
  constructor(private readonly pictureService: PictureService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureCreate(
    @Body() picture: PictureCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<PictureCreateResponse> {
    const { isDryRun } = query;
    const res = await this.pictureService.create(picture, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureSearch(
    @Body() body: PictureSearch,
  ): Promise<PictureSearchResponse> {
    const res = await this.pictureService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureGetById(
    @Param() params: { id: string },
    @Body() body: PicturePopulateRequestBody,
  ): Promise<PictureFindByIdResponse> {
    const { id: pictureId } = params;
    const { populate } = body;
    const res = await this.pictureService.getById(pictureId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: PicturePopulateRequestBody,
  ): Promise<PictureGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.pictureService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async picturePatch(
    @Param() params: { id: string },
    @Body() picture: PicturePatch,
  ): Promise<PicturePatchResponse> {
    const { id: pictureId } = params;
    const res = await this.pictureService.patch(pictureId, picture);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureUpdate(
    @Param() params: { id: string },
    @Body() picture: PictureUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<PictureUpdateResponse> {
    const { id: pictureId } = params;
    const { isDryRun } = query;
    const res = await this.pictureService.update(pictureId, picture, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async pictureArchive(
    @Param() params: { id: string },
  ): Promise<PictureArchiveResponse> {
    const { id: pictureId } = params;
    const res = await this.pictureService.archive(pictureId);
    return ResultHandler.ok(res);
  }
}
