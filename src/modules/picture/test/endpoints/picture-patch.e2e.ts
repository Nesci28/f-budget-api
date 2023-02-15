import { Picture } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { PictureErrors } from "../../picture.errors";
import { PictureContext } from "../picture.e2e-spec";

export function picturePatchTest(): void {
  let ctx: PictureContext;
  let picture: Picture;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    picture = await ctx.pictureRepository.create(ctx.pictureCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.pictureConnector.picturePatch({
      id: picture.id,
      picturePatch: ctx.picturePatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(picture.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.picturePatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Picture", async () => {
    await ctx.pictureRepository.archive(picture.id);

    const result = await ctx.pictureConnector.picturePatch({
      id: picture.id,
      picturePatch: ctx.picturePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(PictureErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid picture id", async () => {
    const fakePictureId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.pictureConnector.picturePatch({
      id: fakePictureId,
      picturePatch: ctx.picturePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(PictureErrors.notFound.uuid);
  });
}
