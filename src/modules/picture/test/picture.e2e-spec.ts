import {
  PictureApi,
  PictureCreate,
  PicturePatch,
  PictureUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { PictureRepository } from "../picture.repository";
import { PictureService } from "../picture.service";
import { pictureArchiveTest } from "./endpoints/picture-archive.e2e";
import { pictureCreateTest } from "./endpoints/picture-create.e2e";
import { pictureGetAllTest } from "./endpoints/picture-get-all.e2e";
import { pictureGetByIdTest } from "./endpoints/picture-get-by-id.e2e";
import { picturePatchTest } from "./endpoints/picture-patch.e2e";
import { pictureSearchTest } from "./endpoints/picture-search.e2e";
import { pictureUpdateTest } from "./endpoints/picture-update.e2e";

export interface PictureContext extends Context<PictureCreate, PictureUpdate> {
  pictureConnector: PictureApi;
  pictureService: PictureService;
  pictureRepository: PictureRepository;
  pictureKey: string;
  pictureCreate: PictureCreate;
  pictureUpdate: PictureUpdate;
  picturePatch: PicturePatch;
  pictureCreates: PictureCreate[];
}

describe("PictureController", () => {
  const ctx = globalThis.context as PictureContext;

  beforeAll(async () => {
    ctx.pictureConnector = ctx.testHandler.prepareConnector(
      PictureApi,
      ctx.config,
    );
    ctx.pictureService = ctx.testHandler.get("PictureService");
    ctx.pictureRepository = ctx.testHandler.get("PictureRepository");

    ctx.pictureCreate = ctx.createOne("PictureCreate", ctx.testHandler, false);
    ctx.pictureCreates = ctx.createMany(
      "PictureCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "PictureUpdate",
      ctx.pictureCreate,
      [],
      ctx.testHandler,
    );
    ctx.pictureKey = key;
    ctx.pictureUpdate = { ...ctx.pictureCreate, ...update };
    ctx.picturePatch = {
      [ctx.pictureKey]: ctx.pictureUpdate[ctx.pictureKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  // TODO: Not implemented yet ngx-webcam
  describe.skip("Picture create", pictureCreateTest.bind({ ctx }));
  describe.skip("Picture search", pictureSearchTest.bind({ ctx }));
  describe.skip("Picture getById", pictureGetByIdTest.bind({ ctx }));
  describe.skip("Picture getAll", pictureGetAllTest.bind({ ctx }));
  describe.skip("Picture patch", picturePatchTest.bind({ ctx }));
  describe.skip("Picture update", pictureUpdateTest.bind({ ctx }));
  describe.skip("Picture archive", pictureArchiveTest.bind({ ctx }));
});
