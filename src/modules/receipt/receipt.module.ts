import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { BalanceModule } from "../balance/balance.module";
import { EnvelopModule } from "../envelop/envelop.module";
import { MongoReceiptSchema } from "./models/receipt.model";
import { ReceiptController } from "./receipt.controller";
import { ReceiptRepository } from "./receipt.repository";
import { ReceiptService } from "./receipt.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoReceipt",
          schema: MongoReceiptSchema,
        },
      ],
      "f-budget",
    ),
    EnvelopModule,
    BalanceModule,
  ],
  controllers: [ReceiptController],
  providers: [
    ReceiptService,
    ReceiptRepository,
    { provide: "ReceiptService", useExisting: ReceiptService },
    { provide: "ReceiptRepository", useExisting: ReceiptRepository },
  ],
  exports: [ReceiptService],
})
export class ReceiptModule {}
