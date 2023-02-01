import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { MongoModuleSchema } from "./models/module.model";
import { ModuleController } from "./module.controller";
import { ModuleRepository } from "./module.repository";
import { ModuleService } from "./module.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoModule",
          schema: MongoModuleSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
  ],
  controllers: [ModuleController],
  providers: [
    ModuleService,
    ModuleRepository,
    { provide: "ModuleService", useExisting: ModuleService },
    { provide: "ModuleRepository", useExisting: ModuleRepository },
  ],
  exports: [ModuleService],
})
export class ModuleModule {}
