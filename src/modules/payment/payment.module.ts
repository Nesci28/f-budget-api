import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoPaymentSchema } from "./models/payment.model";
import { PaymentController } from "./payment.controller";
import { PaymentRepository } from "./payment.repository";
import { PaymentService } from "./payment.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoPayment",
          schema: MongoPaymentSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentRepository,
    { provide: "PaymentService", useExisting: PaymentService },
    { provide: "PaymentRepository", useExisting: PaymentRepository },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
