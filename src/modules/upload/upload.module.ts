import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { MongoUploadSchema } from "./models/upload.model";
import { UploadController } from "./upload.controller";
import { UploadRepository } from "./upload.repository";
import { UploadService } from "./upload.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoUpload",
          schema: MongoUploadSchema,
        },
      ],
      "f-budget",
    ),
  ],
  controllers: [UploadController],
  providers: [
    UploadService,
    UploadRepository,
    { provide: "UploadService", useExisting: UploadService },
    { provide: "UploadRepository", useExisting: UploadRepository },
  ],
  exports: [UploadService],
})
export class UploadModule {}
