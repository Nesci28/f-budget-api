import { UploadContext } from "../upload.e2e-spec";

export function uploadGetAllTest(): void {
  let ctx: UploadContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.uploadRepository.createMany(ctx.uploadCreates);
  });

  it("should return an array of Uploads", async () => {
    const results = await ctx.uploadConnector.uploadGetAll({
      uploadPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.length).toEqual(20);
  });
}
