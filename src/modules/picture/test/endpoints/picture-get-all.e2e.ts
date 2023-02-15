import { PictureContext } from "../picture.e2e-spec";

export function pictureGetAllTest(): void {
  let ctx: PictureContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.pictureRepository.createMany(ctx.pictureCreates);
  });

  it("should return an array of Pictures", async () => {
    const results = await ctx.pictureConnector.pictureGetAll({
      picturePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
