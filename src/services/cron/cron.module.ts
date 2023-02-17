import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { EnvelopModule } from "../../modules/envelop/envelop.module";
import { PaymentModule } from "../../modules/payment/payment.module";
import { ReceiptModule } from "../../modules/receipt/receipt.module";
import { RenewModule } from "../../modules/renew/renew.module";
import { CronService } from "./cron.service";

@Module({
  imports: [
    RenewModule,
    ReceiptModule,
    EnvelopModule,
    PaymentModule,
    ConfigModule,
    HttpModule,
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
