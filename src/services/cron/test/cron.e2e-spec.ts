import {
  BasicOperator,
  Envelop,
  EnvelopCreate,
  EnvelopType,
  ReceiptCreate,
  RenewCreate,
  RenewFrequence,
  RenewType,
  User,
  UserCreate,
} from "@f-budget/f-budget-api-typescript-fetch";

import { Context } from "../../../../test/global";
import { EnvelopService } from "../../../modules/envelop/envelop.service";
import { ReceiptService } from "../../../modules/receipt/receipt.service";
import { RenewService } from "../../../modules/renew/renew.service";
import { UserService } from "../../../modules/user/user.service";
import { DateUtil } from "../../../utils/date.util";
import { CronService } from "../cron.service";

export interface CronContext extends Context<never, never> {
  cronService: CronService;
  userService: UserService;
  envelopService: EnvelopService;
  receiptService: ReceiptService;
  renewService: RenewService;
}

describe("CronController", () => {
  const ctx = globalThis.context as CronContext;
  let user: User;
  let envelopEntertainement1: Envelop;
  let envelopEntertainement2: Envelop;
  let envelopSalary: Envelop;
  let envelopHouse: Envelop;
  let envelopCellphone: Envelop;
  let envelopAllocation: Envelop;
  let envelopTaxes: Envelop;

  beforeAll(async () => {
    ctx.cronService = ctx.testHandler.get("CronService");
    ctx.userService = ctx.testHandler.get("UserService");
    ctx.envelopService = ctx.testHandler.get("EnvelopService");
    ctx.receiptService = ctx.testHandler.get("ReceiptService");
    ctx.renewService = ctx.testHandler.get("RenewService");
  });

  beforeEach(async () => {
    await ctx.mongoMemory.clean();
    jest.restoreAllMocks();

    jest
      .spyOn<any, any>(ctx.cronService, "setDate")
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});

    const userCreate: UserCreate = {
      email: "test@test.com",
      password: "testtest",
    };
    user = await ctx.userService.create(userCreate);
    const envelopCreates: EnvelopCreate[] = [
      {
        userId: user.id,
        name: "salary",
        type: EnvelopType.Income,
      },
      {
        userId: user.id,
        name: "entertainment - 1",
        budget: 150 * 100,
        type: EnvelopType.Outcome,
      },
      {
        userId: user.id,
        name: "entertainment - 2",
        budget: 150 * 100,
        type: EnvelopType.Outcome,
      },
      {
        userId: user.id,
        name: "house & maintenance",
        budget: 1500 * 100,
        type: EnvelopType.Outcome,
      },
      {
        userId: user.id,
        name: "cellphone",
        budget: 31.24 * 100,
        type: EnvelopType.Outcome,
      },
      {
        userId: user.id,
        name: "allocation",
        type: EnvelopType.Income,
      },
      {
        userId: user.id,
        name: "taxes",
        type: EnvelopType.Outcome,
        budget: 2000 * 100,
      },
    ];
    const [
      envelop0,
      envelop1,
      envelop2,
      envelop3,
      envelop4,
      envelop5,
      envelop6,
    ] = await ctx.envelopService.createMany(envelopCreates);
    envelopEntertainement1 = envelop1;
    envelopEntertainement2 = envelop2;
    envelopSalary = envelop0;
    envelopHouse = envelop3;
    envelopCellphone = envelop4;
    envelopAllocation = envelop5;
    envelopTaxes = envelop6;
  });

  it("should reset the envelop on the first day of the month", async () => {
    const receiptCreates: ReceiptCreate[] = [
      {
        userId: user.id,
        envelopId: envelopEntertainement1.id,
        date: new Date(),
        amount: 25 * 100,
      },
      {
        userId: user.id,
        envelopId: envelopEntertainement2.id,
        date: new Date(),
        amount: 30 * 100,
      },
    ];
    await ctx.receiptService.createMany(receiptCreates);

    const startingEnvelops = (
      await ctx.envelopService.search({
        and: [
          {
            id: [
              {
                operator: BasicOperator.Equal,
                values: [envelopEntertainement1.id, envelopEntertainement2.id],
              },
            ],
          },
        ],
      })
    ).value;
    expect(startingEnvelops).toHaveLength(2);

    await ctx.cronService.resetEnvelops();

    const endingEnvelops = (
      await ctx.envelopService.search({
        and: [
          {
            id: [
              {
                operator: BasicOperator.Equal,
                values: [envelopEntertainement1.id, envelopEntertainement2.id],
              },
            ],
          },
        ],
      })
    ).value;
    endingEnvelops.forEach((x, i) => {
      expect(x.incomeMonth).toEqual(x.budget);
      expect(x.incomeTotal).toEqual((x.budget || 0) * 2);
      expect(x.outcomeMonth).toEqual(0);
      expect(x.outcomeTotal).toEqual(i === 0 ? 25 * 100 : 30 * 100);
    });
  });

  it("should NOT renew for a weekend day and isBusinessDay true", async () => {
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopHouse.id,
      amount: 1023.99 * 100,
      description: "Mortgage",
      type: RenewType.DayOfMonth,
      dayOfMonth: 12,
      isBusinessDay: true,
      frequence: RenewFrequence.EveryMonth,
    };
    await ctx.renewService.create(renewCreate);

    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(12);
    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(0);

    const envelop = await ctx.envelopService.getById(envelopHouse.id);
    expect(envelop.outcomeMonth).toBeUndefined();
  });

  it("should renew for a weekend day and isBusinessDay true", async () => {
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopHouse.id,
      amount: 1023.99 * 100,
      description: "Mortgage",
      type: RenewType.DayOfMonth,
      dayOfMonth: 12,
      isBusinessDay: true,
      frequence: RenewFrequence.EveryMonth,
    };
    await ctx.renewService.create(renewCreate);

    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(13);
    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(1);

    const envelop = await ctx.envelopService.getById(envelopHouse.id);
    expect(envelop.outcomeMonth).toEqual(1023.99 * 100);
  });

  it("should renew today Month, Monthly", async () => {
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopCellphone.id,
      amount: 31.24 * 100,
      description: "Cellphone",
      type: RenewType.DayOfMonth,
      dayOfMonth: 12,
      isBusinessDay: false,
      frequence: RenewFrequence.EveryMonth,
    };
    await ctx.renewService.create(renewCreate);

    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(12);
    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(1);

    const envelop = await ctx.envelopService.getById(envelopCellphone.id);
    expect(envelop.outcomeMonth).toEqual(31.24 * 100);
  });

  it("should NOT renew today Month, on a 3 Month renew", async () => {
    const january1 = new Date();
    january1.setMonth(0);
    january1.setDate(1);

    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopAllocation.id,
      amount: 399.99 * 100,
      description: "Allocation QC",
      type: RenewType.DayOfMonth,
      dayOfMonth: 1,
      isBusinessDay: false,
      frequence: RenewFrequence.Every3Months,
      startDate: january1,
    };
    await ctx.renewService.create(renewCreate);

    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(1);
    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(0);

    const envelop = await ctx.envelopService.getById(envelopAllocation.id);
    expect(envelop.outcomeMonth).toBeUndefined();
  });

  it("should renew today Month, on a 3 Month renew", async () => {
    const january1 = new Date();
    january1.setMonth(0);
    january1.setDate(1);

    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopAllocation.id,
      amount: 399.99 * 100,
      description: "Allocation QC",
      type: RenewType.DayOfMonth,
      dayOfMonth: 1,
      isBusinessDay: false,
      frequence: RenewFrequence.Every3Months,
      startDate: january1,
    };
    await ctx.renewService.create(renewCreate);

    const date = new Date();
    date.setFullYear(2024);
    date.setMonth(0);
    date.setDate(1);
    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(1);

    const envelop = await ctx.envelopService.getById(envelopAllocation.id);
    expect(envelop.incomeMonth).toEqual(399.99 * 100);
  });

  it("should renew today Week, Weekly", async () => {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(16);
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopSalary.id,
      amount: 887.93 * 100,
      description: "Salary",
      type: RenewType.DayOfWeek,
      dayOfWeek: DateUtil.getWeekDay(date),
      frequence: RenewFrequence.EveryWeek,
    };
    await ctx.renewService.create(renewCreate);

    ctx.cronService.today = DateUtil.newDateFrom(date);

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(1);

    const envelop = await ctx.envelopService.getById(envelopSalary.id);
    expect(envelop.incomeMonth).toEqual(887.93 * 100);
  });

  it("should NOT renew today Week, Bi-weekly", async () => {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(1);
    date.setDate(16);
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopSalary.id,
      amount: 887.93 * 100,
      description: "Salary",
      type: RenewType.DayOfWeek,
      dayOfWeek: DateUtil.getWeekDay(date),
      frequence: RenewFrequence.Every2Weeks,
      startDate: date,
    };
    await ctx.renewService.create(renewCreate);

    ctx.cronService.today = DateUtil.newDateFrom(
      DateUtil.addToDate(date, 1, "week"),
    );

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(0);

    const envelop = await ctx.envelopService.getById(envelopSalary.id);
    expect(envelop.incomeMonth).toBeUndefined();
  });

  it("should NOT renew today Month, Yearly", async () => {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(0);
    date.setDate(1);
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopTaxes.id,
      amount: 2000 * 100,
      description: "Taxes",
      type: RenewType.DayOfMonth,
      dayOfMonth: 1,
      frequence: RenewFrequence.EveryYear,
      startDate: date,
    };
    await ctx.renewService.create(renewCreate);

    ctx.cronService.today = DateUtil.newDateFrom(
      DateUtil.addToDate(date, 1, "month"),
    );

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(0);

    const envelop = await ctx.envelopService.getById(envelopSalary.id);
    expect(envelop.incomeMonth).toBeUndefined();
  });

  it("should renew today Month, Yearly", async () => {
    const date = new Date();
    date.setFullYear(2023);
    date.setMonth(0);
    date.setDate(1);
    const renewCreate: RenewCreate = {
      userId: user.id,
      envelopId: envelopTaxes.id,
      amount: 2000 * 100,
      description: "Taxes",
      type: RenewType.DayOfMonth,
      dayOfMonth: 1,
      frequence: RenewFrequence.EveryYear,
      startDate: date,
    };
    await ctx.renewService.create(renewCreate);

    ctx.cronService.today = DateUtil.newDateFrom(
      DateUtil.addToDate(date, 1, "year"),
    );

    await ctx.cronService.checkForRenew();

    const receipts = await ctx.receiptService.getAll();
    expect(receipts).toHaveLength(1);

    const envelop = await ctx.envelopService.getById(envelopTaxes.id);
    expect(envelop.outcomeMonth).toEqual(2000 * 100);
  });
});
