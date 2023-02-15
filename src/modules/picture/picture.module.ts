import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoPictureSchema } from "./models/picture.model";
import { PictureController } from "./picture.controller";
import { PictureRepository } from "./picture.repository";
import { PictureService } from "./picture.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoPicture",
          schema: MongoPictureSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [PictureController],
  providers: [
    PictureService,
    PictureRepository,
    { provide: "PictureService", useExisting: PictureService },
    { provide: "PictureRepository", useExisting: PictureRepository },
  ],
  exports: [PictureService],
})
export class PictureModule {}
