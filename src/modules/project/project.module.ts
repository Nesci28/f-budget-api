import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { MongoProjectSchema } from "./models/project.model";
import { ProjectController } from "./project.controller";
import { ProjectRepository } from "./project.repository";
import { ProjectService } from "./project.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoProject",
          schema: MongoProjectSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
  ],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    ProjectRepository,
    { provide: "ProjectService", useExisting: ProjectService },
    { provide: "ProjectRepository", useExisting: ProjectRepository },
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
