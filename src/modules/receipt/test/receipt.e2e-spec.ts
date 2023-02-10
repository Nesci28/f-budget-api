import {
  ReceiptApi,
  ReceiptCreate,
  ReceiptPatch,
  ReceiptUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { ReceiptRepository } from "../receipt.repository";
import { ReceiptService } from "../receipt.service";
import { receiptArchiveTest } from "./endpoints/receipt-archive.e2e";
import { receiptCreateTest } from "./endpoints/receipt-create.e2e";
import { receiptGetAllTest } from "./endpoints/receipt-get-all.e2e";
import { receiptGetByIdTest } from "./endpoints/receipt-get-by-id.e2e";
import { receiptPatchTest } from "./endpoints/receipt-patch.e2e";
import { receiptSearchTest } from "./endpoints/receipt-search.e2e";
import { receiptUpdateTest } from "./endpoints/receipt-update.e2e";

export interface ReceiptContext extends Context<ReceiptCreate, ReceiptUpdate> {
  receiptConnector: ReceiptApi;
  receiptService: ReceiptService;
  receiptRepository: ReceiptRepository;
  receiptKey: string;
  receiptCreate: ReceiptCreate;
  receiptUpdate: ReceiptUpdate;
  receiptPatch: ReceiptPatch;
  receiptCreates: ReceiptCreate[];
}

describe("ReceiptController", () => {
  const ctx = globalThis.context as ReceiptContext;

  beforeAll(async () => {
    ctx.receiptConnector = ctx.testHandler.prepareConnector(
      ReceiptApi,
      ctx.config,
    );
    ctx.receiptService = ctx.testHandler.get("ReceiptService");
    ctx.receiptRepository = ctx.testHandler.get("ReceiptRepository");

    ctx.receiptCreate = ctx.createOne("ReceiptCreate", ctx.testHandler, false);
    ctx.receiptCreates = ctx.createMany(
      "ReceiptCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "ReceiptUpdate",
      ctx.receiptCreate,
      [],
      ctx.testHandler,
    );
    ctx.receiptKey = key;
    ctx.receiptUpdate = { ...ctx.receiptCreate, ...update };
    ctx.receiptPatch = {
      [ctx.receiptKey]: ctx.receiptUpdate[ctx.receiptKey],
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

  describe("Receipt create", receiptCreateTest.bind({ ctx }));
  describe("Receipt search", receiptSearchTest.bind({ ctx }));
  describe("Receipt getById", receiptGetByIdTest.bind({ ctx }));
  describe("Receipt getAll", receiptGetAllTest.bind({ ctx }));
  describe("Receipt patch", receiptPatchTest.bind({ ctx }));
  describe("Receipt update", receiptUpdateTest.bind({ ctx }));
  describe("Receipt archive", receiptArchiveTest.bind({ ctx }));
});
