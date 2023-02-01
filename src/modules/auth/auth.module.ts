import { Module } from "@nestjs/common";

import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "./jwt.module";
import { RefreshLongModule } from "./refresh-long.module";
import { RefreshShortModule } from "./refresh-short.module";

@Module({
  imports: [JwtModule, RefreshLongModule, RefreshShortModule, UserModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: "AuthService", useExisting: AuthService },
  ],
  exports: [AuthService],
})
export class AuthModule {}
