import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { EndpointController } from "./endpoint.controller";
import { EndpointRepository } from "./endpoint.repository";
import { EndpointService } from "./endpoint.service";
import { MongoEndpointSchema } from "./models/endpoint.model";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoEndpoint",
          schema: MongoEndpointSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
  ],
  controllers: [EndpointController],
  providers: [
    EndpointService,
    EndpointRepository,
    { provide: "EndpointService", useExisting: EndpointService },
    { provide: "EndpointRepository", useExisting: EndpointRepository },
  ],
  exports: [EndpointService],
})
export class EndpointModule {}
