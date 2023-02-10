import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoRenewSchema } from "./models/renew.model";
import { RenewController } from "./renew.controller";
import { RenewRepository } from "./renew.repository";
import { RenewService } from "./renew.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoRenew",
          schema: MongoRenewSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [RenewController],
  providers: [
    RenewService,
    RenewRepository,
    { provide: "RenewService", useExisting: RenewService },
    { provide: "RenewRepository", useExisting: RenewRepository },
  ],
  exports: [RenewService],
})
export class RenewModule {}
