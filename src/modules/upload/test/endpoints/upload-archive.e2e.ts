import { StatusCodes } from "http-status-codes";

import { UploadErrors } from "../../upload.errors";
import { UploadContext } from "../upload.e2e-spec";

export function uploadArchiveTest(): void {
  let ctx: UploadContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Upload", async () => {
    const upload = await ctx.uploadRepository.create(ctx.uploadCreate);

    const result = await ctx.uploadConnector.uploadArchive({ id: upload.id });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Upload id", async () => {
    const fakeUploadId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.uploadConnector.uploadArchive({
      id: fakeUploadId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(UploadErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Upload", async () => {
    const upload = await ctx.uploadRepository.create(ctx.uploadCreate);
    await ctx.uploadRepository.archive(upload.id);

    const result = await ctx.uploadConnector.uploadArchive({ id: upload.id });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(UploadErrors.alreadyArchived.uuid);
  });
}
