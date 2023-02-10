import { Module } from "@nestjs/common";

import { ReceiptModule } from "../../modules/receipt/receipt.module";
import { RenewModule } from "../../modules/renew/renew.module";
import { CronService } from "./cron.service";

@Module({
  imports: [RenewModule, ReceiptModule],
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
