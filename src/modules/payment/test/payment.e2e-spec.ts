import {
  PaymentApi,
  PaymentCreate,
  PaymentPatch,
  PaymentUpdate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { PaymentRepository } from "../payment.repository";
import { PaymentService } from "../payment.service";
import { paymentArchiveTest } from "./endpoints/payment-archive.e2e";
import { paymentCreateTest } from "./endpoints/payment-create.e2e";
import { paymentGetAllTest } from "./endpoints/payment-get-all.e2e";
import { paymentGetByIdTest } from "./endpoints/payment-get-by-id.e2e";
import { paymentPatchTest } from "./endpoints/payment-patch.e2e";
import { paymentSearchTest } from "./endpoints/payment-search.e2e";
import { paymentUpdateTest } from "./endpoints/payment-update.e2e";

export interface PaymentContext extends Context<PaymentCreate, PaymentUpdate> {
  paymentConnector: PaymentApi;
  paymentService: PaymentService;
  paymentRepository: PaymentRepository;
  paymentKey: string;
  paymentCreate: PaymentCreate;
  paymentUpdate: PaymentUpdate;
  paymentPatch: PaymentPatch;
  paymentCreates: PaymentCreate[];
}

describe("PaymentController", () => {
  const ctx = globalThis.context as PaymentContext;

  beforeAll(async () => {
    ctx.paymentConnector = ctx.testHandler.prepareConnector(
      PaymentApi,
      ctx.config,
    );
    ctx.paymentService = ctx.testHandler.get("PaymentService");
    ctx.paymentRepository = ctx.testHandler.get("PaymentRepository");

    ctx.paymentCreate = ctx.createOne("PaymentCreate", ctx.testHandler, false);
    ctx.paymentCreates = ctx.createMany(
      "PaymentCreate",
      ctx.testHandler,
      false,
      20,
    );
    const { key, update } = ctx.updateField(
      "PaymentUpdate",
      ctx.paymentCreate,
      [],
      ctx.testHandler,
    );
    ctx.paymentKey = key;
    ctx.paymentUpdate = { ...ctx.paymentCreate, ...update };
    ctx.paymentPatch = {
      [ctx.paymentKey]: ctx.paymentUpdate[ctx.paymentKey],
    };
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();
  });

  describe("Payment create", paymentCreateTest.bind({ ctx }));
  describe("Payment search", paymentSearchTest.bind({ ctx }));
  describe("Payment getById", paymentGetByIdTest.bind({ ctx }));
  describe("Payment getAll", paymentGetAllTest.bind({ ctx }));
  describe("Payment patch", paymentPatchTest.bind({ ctx }));
  describe("Payment update", paymentUpdateTest.bind({ ctx }));
  describe("Payment archive", paymentArchiveTest.bind({ ctx }));
});
