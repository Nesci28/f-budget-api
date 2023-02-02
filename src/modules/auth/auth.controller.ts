import { Body, Controller, Query, Res, UseGuards } from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { ResultHandler } from "@yest/result-handler";
import { InternalServerException } from "@yest/router";
import {
  LocalPayload,
  RefreshPayload,
  RefreshTokenGuard,
  UserAgent,
  UserAgentInfo,
} from "@yest/security";
import {
  JwtTokenPayload,
  LoginRequestBody,
  LoginResponse,
  RefreshResponse,
  RefreshToken,
  User,
} from "@yest/yest-stats-api-typescript-fetch";
import { Response } from "express";

import { configs } from "../../constants/configs.constant";
import { LocalGuard } from "../../guards/local.guard";
import { DateUtil } from "../../utils/date.util";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle(configs.throttlerLoginLimit, configs.throttlerTTL)
  @UseGuards(LocalGuard)
  public async login(
    @LocalPayload() user: User,
    @UserAgent() userAgentInfo: UserAgentInfo,
    @Body() loginRequestBody: LoginRequestBody,
  ): Promise<LoginResponse> {
    const { rememberMe, deviceUUID } = loginRequestBody;
    const { userAgent } = userAgentInfo;
    const jwt = await this.authService.generateJwtPayload(user);

    const token = this.authService.signRefreshToken(user.id, rememberMe);
    const date = DateUtil.newDate().getTime();
    const refreshToken: RefreshToken = {
      token,
      userAgent,
      deviceUUID,
      rememberMe,
      iat: date,
      exp: rememberMe
        ? date + configs.refreshExpirationLongMS
        : date + configs.refreshExpirationShortMS,
    };

    await this.authService.addRefreshTokenToUser(user.id, refreshToken);

    return ResultHandler.ok({ jwt, refreshToken: token });
  }

  @UseGuards(RefreshTokenGuard)
  public async refreshToken(
    @Query() query: { id?: string },
    @RefreshPayload()
    refreshPayload: {
      refreshToken: string;
      user: JwtTokenPayload;
    },
    @UserAgent() userAgentInfo: UserAgentInfo,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponse> {
    const { refreshToken, user: userPayload } = refreshPayload;
    const { userAgent } = userAgentInfo;
    const { userId } = userPayload;

    await this.authService.verifyRefreshToken(refreshToken);

    const user = await this.authService.validateUserByRefreshToken(
      userId,
      refreshToken,
    );
    const currentRefreshTokenPayload = user.refreshTokens?.find((x) => {
      return x.token === refreshToken;
    });
    if (!currentRefreshTokenPayload) {
      throw new InternalServerException(
        "currentRefreshTokenPayload must be defined",
      );
    }
    const { deviceUUID, rememberMe } = currentRefreshTokenPayload;

    const date = DateUtil.newDate().getTime();
    const exp = rememberMe
      ? date + configs.refreshExpirationLongMS
      : date + configs.refreshExpirationShortMS;
    const refreshTokenUpdated: RefreshToken = {
      token: refreshToken,
      userAgent,
      deviceUUID,
      rememberMe,
      iat: date,
      exp,
    };
    const signedRefreshToken = this.authService.signRefreshToken(
      userId,
      rememberMe,
    );
    await this.authService.addRefreshTokenToUser(userId, refreshTokenUpdated);

    const jwt = await this.authService.generateJwtPayload(user);

    const value = { jwt, refreshToken: signedRefreshToken };

    response.set({ exp, "Access-Control-Expose-Headers": "exp" });
    return ResultHandler.ok(value);
  }
}
