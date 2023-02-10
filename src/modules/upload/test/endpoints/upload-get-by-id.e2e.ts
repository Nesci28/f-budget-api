import { Upload } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { UploadErrors } from "../../upload.errors";
import { UploadContext } from "../upload.e2e-spec";

export function uploadGetByIdTest(): void {
  let ctx: UploadContext;
  let uploads: Upload[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    uploads = await ctx.uploadRepository.createMany(ctx.uploadCreates);
  });

  it("should return a specific Upload", async () => {
    const results = await ctx.uploadConnector.uploadGetById({
      id: uploads[0].id,
      uploadPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(uploads[0].id);
  });

  it("should return not found when using an invalid Upload id", async () => {
    const fakeUploadId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.uploadConnector.uploadGetById({
      id: fakeUploadId,
      uploadPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(UploadErrors.notFound.uuid);
  });
}
