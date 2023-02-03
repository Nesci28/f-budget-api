import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { ProjectModule } from "../project/project.module";
import { MongoResponseSchema } from "./models/response.model";
import { ResponseController } from "./response.controller";
import { ResponseRepository } from "./response.repository";
import { ResponseService } from "./response.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoResponse",
          schema: MongoResponseSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
    BullModule.registerQueue({
      name: "response",
    }),
    ProjectModule,
  ],
  controllers: [ResponseController],
  providers: [
    ResponseService,
    ResponseRepository,
    { provide: "ResponseService", useExisting: ResponseService },
    { provide: "ResponseRepository", useExisting: ResponseRepository },
  ],
  exports: [ResponseService],
})
export class ResponseModule {}
