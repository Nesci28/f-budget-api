import { Picture } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { PictureErrors } from "../../picture.errors";
import { PictureContext } from "../picture.e2e-spec";

export function pictureGetByIdTest(): void {
  let ctx: PictureContext;
  let pictures: Picture[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    pictures = await ctx.pictureRepository.createMany(ctx.pictureCreates);
  });

  it("should return a specific Picture", async () => {
    const results = await ctx.pictureConnector.pictureGetById({
      id: pictures[0].id,
      picturePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(pictures[0].id);
  });

  it("should return not found when using an invalid Picture id", async () => {
    const fakePictureId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.pictureConnector.pictureGetById({
      id: fakePictureId,
      picturePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(PictureErrors.notFound.uuid);
  });
}
