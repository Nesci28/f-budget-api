import { PictureContext } from "../picture.e2e-spec";

export function pictureCreateTest(): void {
  let ctx: PictureContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Picture", async () => {
    const result = await ctx.pictureConnector.pictureCreate({
      pictureCreate: ctx.pictureCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.pictureCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Picture as dry-run (not saving)", async () => {
    const result = await ctx.pictureConnector.pictureCreate({
      pictureCreate: ctx.pictureCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.pictureConnector.pictureGetById({
      id: result.value!.id,
      picturePopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.pictureCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
