import { Module } from "@nestjs/common";

import { CronService } from "./cron.service";

@Module({
  imports: [],
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
