import { UploadContext } from "../upload.e2e-spec";

export function uploadCreateTest(): void {
  let ctx: UploadContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should create a new Upload", async () => {
    const result = await ctx.uploadConnector.uploadCreate({
      uploadCreate: ctx.uploadCreate,
    });

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.uploadCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should create a new Upload as dry-run (not saving)", async () => {
    const result = await ctx.uploadConnector.uploadCreate({
      uploadCreate: ctx.uploadCreate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.uploadConnector.uploadGetById({
      id: result.value!.id,
      uploadPopulateRequestBody: {},
    });
    expect(checkFindResult.isSuccess).toEqual(false);
    expect(checkFindResult.error?.httpCode).toEqual(404);

    expect(result.isSuccess).toEqual(true);
    const res = ctx.testHandler.traverseObjects(
      ctx.uploadCreate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });
}
