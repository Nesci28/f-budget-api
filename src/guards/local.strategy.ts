import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User } from "@yest/yest-stats-api-typescript-fetch";
import { Strategy } from "passport-local";

import { AuthService } from "../modules/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: "email",
    });
  }

  public async validate(phoneNumber: string, password: string): Promise<User> {
    const user = await this.authService.login(phoneNumber, password);
    return user;
  }
}
