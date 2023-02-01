import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { MongoRequestSchema } from "./models/request.model";
import { RequestController } from "./request.controller";
import { RequestRepository } from "./request.repository";
import { RequestService } from "./request.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoRequest",
          schema: MongoRequestSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
  ],
  controllers: [RequestController],
  providers: [
    RequestService,
    RequestRepository,
    { provide: "RequestService", useExisting: RequestService },
    { provide: "RequestRepository", useExisting: RequestRepository },
  ],
  exports: [RequestService],
})
export class RequestModule {}
