import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { EnvelopController } from "./envelop.controller";
import { EnvelopRepository } from "./envelop.repository";
import { EnvelopService } from "./envelop.service";
import { MongoEnvelopSchema } from "./models/envelop.model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoEnvelop",
          schema: MongoEnvelopSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [EnvelopController],
  providers: [
    EnvelopService,
    EnvelopRepository,
    { provide: "EnvelopService", useExisting: EnvelopService },
    { provide: "EnvelopRepository", useExisting: EnvelopRepository },
  ],
  exports: [EnvelopService],
})
export class EnvelopModule {}
