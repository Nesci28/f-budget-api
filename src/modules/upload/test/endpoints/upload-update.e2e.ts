import { Upload } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { UploadErrors } from "../../upload.errors";
import { UploadContext } from "../upload.e2e-spec";

export function uploadUpdateTest(): void {
  let ctx: UploadContext;
  let upload: Upload;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    upload = await ctx.uploadRepository.create(ctx.uploadCreate);
  });

  it("should update the specified Upload", async () => {
    const result = await ctx.uploadConnector.uploadUpdate({
      id: upload.id,
      uploadUpdate: ctx.uploadUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(upload.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.uploadUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Upload as dry-run (not saving)", async () => {
    const result = await ctx.uploadConnector.uploadUpdate({
      id: upload.id,
      uploadUpdate: ctx.uploadUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.uploadRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.uploadUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(upload.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.uploadUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Upload", async () => {
    await ctx.uploadRepository.archive(upload.id);

    const result = await ctx.uploadConnector.uploadUpdate({
      id: upload.id,
      uploadUpdate: ctx.uploadUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(UploadErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Upload id", async () => {
    const fakeUploadId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.uploadConnector.uploadUpdate({
      id: fakeUploadId,
      uploadUpdate: ctx.uploadUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(UploadErrors.notFound.uuid);
  });
}
