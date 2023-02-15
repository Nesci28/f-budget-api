import {
  AdvancedOperator,
  BasicOperator,
  EnvelopPatch,
  EnvelopSearch,
  ReceiptCreate,
  Renew,
  RenewFrequence,
  RenewSearch,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { EnvelopService } from "../../modules/envelop/envelop.service";
import { ReceiptService } from "../../modules/receipt/receipt.service";
import { RenewService } from "../../modules/renew/renew.service";
import { DateUtil } from "../../utils/date.util";

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);

  constructor(
    private readonly renewService: RenewService,
    private readonly receiptService: ReceiptService,
    private readonly envelopService: EnvelopService,
  ) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  public async fullEnvelops(): Promise<void> {
    const startTime = new Date().getTime();
    this.logger.debug("Fulling envelopes");

    const envelopSearch: EnvelopSearch = {
      pagination: {
        limit: -1,
      },
      and: [{ archived: [{ operator: BasicOperator.Equal, value: false }] }],
    };
    const envelopSearchApi = await this.envelopService.search(envelopSearch);
    const envelops = envelopSearchApi.value;

    for (let i = 0; i < envelops.length; i += 1) {
      const envelop = envelops[i];
      const { incomeMonth, incomeTotal, id: envelopId, budget } = envelop;
      const envelopPatch: EnvelopPatch = {
        incomeMonth: (incomeMonth || 0) + (budget || 0),
        incomeTotal: (incomeTotal || 0) + (budget || 0),
        outcomeMonth: 0,
      };
      // eslint-disable-next-line no-await-in-loop
      await this.envelopService.patch(envelopId, envelopPatch);
    }

    const endTime = new Date().getTime();
    const totalTime = endTime - startTime;
    this.logger.debug(`Fulling envelopes - Done (${totalTime}ms)`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async checkForRenew(): Promise<void> {
    const startTime = new Date().getTime();
    this.logger.debug("Checking for Renew");

    const today = DateUtil.newDate();
    const renews: Renew[] = [];

    // Get weekend and isBusinessDay renews if we are monday
    const isMonday = DateUtil.isMonday(today);
    if (isMonday) {
      const weekendRenews = await this.searchForBusinessDayRenewsWeekend(today);
      renews.push(...weekendRenews);
    }

    // Get today's Renews
    const todayMonthRenews = await this.searchForTodayMonthRenews(today);
    renews.push(...todayMonthRenews);

    // Get dayOfWeeks renews
    const todayWeekRenews = await this.searchForTodayWeekRenews(today);
    renews.push(...todayWeekRenews);

    const receiptCreates: ReceiptCreate[] = [];
    for (let i = 0; i < renews.length; i += 1) {
      const renew = renews[i];

      // Create the receipt
      const { envelopId, amount, userId, description, id: renewId } = renew;
      const receiptCreate: ReceiptCreate = {
        envelopId,
        date: today,
        amount,
        description,
        userId,
        renewId,
      };
      receiptCreates.push(receiptCreate);
    }

    await this.receiptService.createMany(receiptCreates);

    const endTime = new Date().getTime();
    const totalTime = endTime - startTime;
    this.logger.debug(`Checking for Renew - Done (${totalTime}ms)`);
  }

  private async searchForTodayWeekRenews(today: Date): Promise<Renew[]> {
    const dayOfWeek = DateUtil.getWeekDay(today);
    const isTodayWeekNumberEven = DateUtil.isWeekNumberEven(today);
    const renewSearch: RenewSearch = {
      pagination: {
        limit: -1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          dayOfWeek: [
            { operator: AdvancedOperator.Equal, values: [dayOfWeek] },
          ],
        },
      ],
    };
    const renewSearchApi = await this.renewService.search(renewSearch);
    const allRenews = renewSearchApi.value;

    const renews: Renew[] = [];

    // Every Week
    const everyWeekRenews = allRenews.filter((x) => {
      return x.frequence === RenewFrequence.EveryWeek;
    });
    renews.push(...everyWeekRenews);

    // Every 2 weeks
    const every2WeeksRenews = allRenews.filter((x) => {
      const { frequence, startDate } = x;
      const isEvery2Weeks = frequence === RenewFrequence.Every2Weeks;
      if (!isEvery2Weeks || !startDate) {
        return false;
      }
      const isWeekNumberEven = DateUtil.isWeekNumberEven(startDate);
      const isSameWeekType = isWeekNumberEven === isTodayWeekNumberEven;
      return isSameWeekType;
    });
    renews.push(...every2WeeksRenews);

    return renews;
  }

  private async searchForTodayMonthRenews(today: Date): Promise<Renew[]> {
    const isBusinessDay = DateUtil.isBusinessDay(today);
    const dayOfMonth = DateUtil.getMonthDay(today);
    const renewSearch: RenewSearch = {
      pagination: {
        limit: -1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          dayOfMonth: [
            { operator: AdvancedOperator.Equal, values: [dayOfMonth] },
          ],
        },
      ],
    };
    if (!isBusinessDay) {
      renewSearch.and!.push({
        isBusinessDay: [{ operator: BasicOperator.Equal, value: false }],
      });
    }
    const renewSearchApi = await this.renewService.search(renewSearch);

    const renews = renewSearchApi.value;
    return renews;
  }

  private async searchForBusinessDayRenewsWeekend(
    today: Date,
  ): Promise<Renew[]> {
    const saturday = DateUtil.getMonthDay(
      DateUtil.addToDate(today, -2, "days"),
    );
    const sunday = DateUtil.getMonthDay(DateUtil.addToDate(today, -1, "days"));

    const renewSearch: RenewSearch = {
      pagination: {
        limit: -1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          dayOfMonth: [
            { operator: AdvancedOperator.Equal, values: [saturday, sunday] },
          ],
        },
        { isBusinessDay: [{ operator: BasicOperator.Equal, value: true }] },
      ],
    };
    const renewSearchApi = await this.renewService.search(renewSearch);

    const renewsAll = renewSearchApi.value;
    const renews: Renew[] = [];

    // Every Month
    const everyMonthRenews = renewsAll.filter((x) => {
      const { frequence } = x;
      const isEveryMonth = frequence === RenewFrequence.EveryMonth;
      return isEveryMonth;
    });
    renews.push(...everyMonthRenews);

    // Every 3 Month
    const every3MonthRenews = renewsAll.filter((x) => {
      const { frequence, startDate } = x;
      if (!startDate) {
        return false;
      }

      const startDateMonth = startDate.getMonth() + 1;

      const isThirdMonth =
        Math.abs(today.getMonth() + 1 - startDateMonth) % 3 === 0;
      const is3EveryMonth = frequence === RenewFrequence.Every3Months;
      return is3EveryMonth && isThirdMonth;
    });
    renews.push(...every3MonthRenews);

    return renews;
  }
}
