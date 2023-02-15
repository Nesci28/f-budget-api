import { Module } from "@nestjs/common";

import { EnvelopModule } from "../../modules/envelop/envelop.module";
import { ReceiptModule } from "../../modules/receipt/receipt.module";
import { RenewModule } from "../../modules/renew/renew.module";
import { CronService } from "./cron.service";

@Module({
  imports: [RenewModule, ReceiptModule, EnvelopModule],
  providers: [
    CronService,
    {
      provide: "CronService",
      useExisting: CronService,
    },
  ],
  exports: [CronService],
})
export class CronModule {}
