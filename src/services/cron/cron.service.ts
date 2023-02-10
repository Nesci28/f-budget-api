import {
  AdvancedOperator,
  BasicOperator,
  ReceiptCreate,
  Renew,
  RenewPopulateEnum,
  RenewSearch,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";

import { ReceiptService } from "../../modules/receipt/receipt.service";
import { RenewService } from "../../modules/renew/renew.service";
import { DateUtil } from "../../utils/date.util";

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);

  constructor(
    private readonly renewService: RenewService,
    private readonly receiptService: ReceiptService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async checkForRenew(): Promise<void> {
    const startTime = new Date().getTime();
    this.logger.debug("Checking for Renew");

    const today = DateUtil.newDate();
    const yesterday = DateUtil.addToDate(today, -1, "day");
    const isTodayABusinessDay = DateUtil.isBusinessDay(today);

    const renews = await this.searchForRenewsWithEnvelop();

    const receiptCreates: ReceiptCreate[] = [];
    for (let i = 0; i < renews.length; i += 1) {
      const renew = renews[i];
      const { date, isBusinessDay } = renew;
      const isToday = DateUtil.isSameDay(date, today);

      // Is not today and isBusinessDay
      if (!isToday && isBusinessDay) {
        const listOfDates = DateUtil.listOfDates(date, yesterday);
        const hasBusinessDayHappened = listOfDates.some((x) => {
          return DateUtil.isBusinessDay(x);
        });
        if (hasBusinessDayHappened) {
          // eslint-disable-next-line no-continue
          continue;
        }
      }

      // isToday but not a business day
      if (isToday && isBusinessDay && !isTodayABusinessDay) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Create the receipt
      const { envelopId, amount, userId, description } = renew;

      const receiptCreate: ReceiptCreate = {
        envelopId,
        date,
        amount,
        description,
        userId,
        isFromRenew: true,
      };
      receiptCreates.push(receiptCreate);
    }

    await this.receiptService.createMany(receiptCreates);

    const endTime = new Date().getTime();
    const totalTime = endTime - startTime;
    this.logger.debug(`Checking for Renew - Done (${totalTime}ms)`);
  }

  private async searchForRenewsWithEnvelop(): Promise<Renew[]> {
    const date = DateUtil.newDate();
    const daysAgo = DateUtil.startOfDay(DateUtil.addToDate(date, -2, "days"));
    const endOfDay = DateUtil.endOfDay(date);
    const renewSearch: RenewSearch = {
      pagination: {
        limit: -1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          date: [
            {
              operator: AdvancedOperator.GreaterThanEqual,
              values: [daysAgo],
            },
          ],
        },
        {
          date: [
            { operator: AdvancedOperator.LesserThanEqual, values: [endOfDay] },
          ],
        },
      ],
      populate: [{ label: RenewPopulateEnum.Envelop }],
    };

    const renewSearchApi = await this.renewService.search(renewSearch);
    const renews = renewSearchApi.value;
    return renews;
  }
}
