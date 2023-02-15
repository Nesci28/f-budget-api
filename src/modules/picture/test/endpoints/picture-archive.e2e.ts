import { StatusCodes } from "http-status-codes";

import { PictureErrors } from "../../picture.errors";
import { PictureContext } from "../picture.e2e-spec";

export function pictureArchiveTest(): void {
  let ctx: PictureContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Picture", async () => {
    const picture = await ctx.pictureRepository.create(ctx.pictureCreate);

    const result = await ctx.pictureConnector.pictureArchive({
      id: picture.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Picture id", async () => {
    const fakePictureId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.pictureConnector.pictureArchive({
      id: fakePictureId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(PictureErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Picture", async () => {
    const picture = await ctx.pictureRepository.create(ctx.pictureCreate);
    await ctx.pictureRepository.archive(picture.id);

    const result = await ctx.pictureConnector.pictureArchive({
      id: picture.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(PictureErrors.alreadyArchived.uuid);
  });
}
