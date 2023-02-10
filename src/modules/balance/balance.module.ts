import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { BalanceController } from "./balance.controller";
import { BalanceRepository } from "./balance.repository";
import { BalanceService } from "./balance.service";
import { MongoBalanceSchema } from "./models/balance.model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoBalance",
          schema: MongoBalanceSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [BalanceController],
  providers: [
    BalanceService,
    BalanceRepository,
    { provide: "BalanceService", useExisting: BalanceService },
    { provide: "BalanceRepository", useExisting: BalanceRepository },
  ],
  exports: [BalanceService],
})
export class BalanceModule {}
