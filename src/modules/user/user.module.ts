import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { configs } from "../../constants/configs.constant";
import { ProjectModule } from "../project/project.module";
import { MongoUserSchema } from "./models/user.model";
import { MongoUserWithPasswordSchema } from "./models/user-with-password.model";
import { UserController } from "./user.controller";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: "MongoUser",
          schema: MongoUserSchema,
        },
        {
          name: "MongoUserWithPassword",
          schema: MongoUserWithPasswordSchema,
        },
      ],
      configs.mongooseConnectionName,
    ),
    ConfigModule,
    ProjectModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    { provide: "UserService", useExisting: UserService },
    { provide: "UserRepository", useExisting: UserRepository },
  ],
  exports: [UserService],
})
export class UserModule {}
