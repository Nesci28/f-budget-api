import {
  UploadApi,
  UploadCreate,
  UploadPatch,
  UploadUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { UploadRepository } from "../upload.repository";
import { UploadService } from "../upload.service";
import { uploadArchiveTest } from "./endpoints/upload-archive.e2e";
import { uploadCreateTest } from "./endpoints/upload-create.e2e";
import { uploadGetAllTest } from "./endpoints/upload-get-all.e2e";
import { uploadGetByIdTest } from "./endpoints/upload-get-by-id.e2e";
import { uploadPatchTest } from "./endpoints/upload-patch.e2e";
import { uploadSearchTest } from "./endpoints/upload-search.e2e";
import { uploadUpdateTest } from "./endpoints/upload-update.e2e";

export interface UploadContext extends Context<UploadCreate, UploadUpdate> {
  uploadConnector: UploadApi;
  uploadService: UploadService;
  uploadRepository: UploadRepository;
  uploadKey: string;
  uploadCreate: UploadCreate;
  uploadUpdate: UploadUpdate;
  uploadPatch: UploadPatch;
  uploadCreates: UploadCreate[];
}

describe("UploadController", () => {
  const ctx = globalThis.context as UploadContext;

  beforeAll(async () => {
    ctx.uploadConnector = ctx.testHandler.prepareConnector(
      UploadApi,
      ctx.config,
    );
    ctx.uploadService = ctx.testHandler.get("UploadService");
    ctx.uploadRepository = ctx.testHandler.get("UploadRepository");

    ctx.uploadCreate = ctx.createOne("UploadCreate", ctx.testHandler, false);
    ctx.uploadCreates = ctx.createMany(
      "UploadCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "UploadUpdate",
      ctx.uploadCreate,
      [],
      ctx.testHandler,
    );
    ctx.uploadKey = key;
    ctx.uploadUpdate = { ...ctx.uploadCreate, ...update };
    ctx.uploadPatch = {
      [ctx.uploadKey]: ctx.uploadUpdate[ctx.uploadKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    await ctx.createOptionIds(
      ctx.testHandler,
      ctx.propertyControlRepository,
      ctx.propertyControlOptionRepository,
    );
    jest.restoreAllMocks();
  });

  describe("Upload create", uploadCreateTest.bind({ ctx }));
  describe("Upload search", uploadSearchTest.bind({ ctx }));
  describe("Upload getById", uploadGetByIdTest.bind({ ctx }));
  describe("Upload getAll", uploadGetAllTest.bind({ ctx }));
  describe("Upload patch", uploadPatchTest.bind({ ctx }));
  describe("Upload update", uploadUpdateTest.bind({ ctx }));
  describe("Upload archive", uploadArchiveTest.bind({ ctx }));
});
