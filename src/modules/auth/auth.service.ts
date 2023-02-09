import {
  DecodedRefreshToken,
  JwtTokenPayload,
  RefreshToken,
  User,
  UserSearch,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { BasicOperator } from "@yest/contract";
import { InternalServerException, ResultHandlerException } from "@yest/router";
import { BaseAuthPayload } from "@yest/security";
import * as bcrypt from "bcrypt";
import { remove, unset } from "lodash";

import { UserService } from "../user/user.service";
import { AuthErrors } from "./auth.errors";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

@Injectable()
export class AuthService {
  constructor(
    @Inject("YestJwtService") private readonly jwtService: JwtService,
    @Inject("YestRefreshLongService")
    private readonly refreshLongService: JwtService,
    @Inject("YestRefreshShortService")
    private readonly refreshShortService: JwtService,
    private readonly userService: UserService,
  ) {}

  public signJwtToken(payload: JwtPayload): string {
    const accessToken = this.jwtService.sign(payload);
    return accessToken;
  }

  public signRefreshToken(userId: string, rememberMe: boolean): string {
    const payload = { userId };
    const options = {
      expiresIn: "9999y",
    };
    const refreshToken = rememberMe
      ? this.refreshLongService.sign(payload, options)
      : this.refreshShortService.sign(payload, options);
    return refreshToken;
  }

  public decodeJwtToken(jwtToken: string): JwtTokenPayload {
    const decodedJwtToken = this.jwtService.decode(jwtToken) as JwtTokenPayload;
    return decodedJwtToken;
  }

  public decodeRefreshToken(refreshToken: string): DecodedRefreshToken {
    const decodedRefreshToken = this.refreshLongService.decode(
      refreshToken,
    ) as DecodedRefreshToken;
    return decodedRefreshToken;
  }

  public async verifyRefreshToken(
    refreshToken: string,
  ): Promise<BaseAuthPayload> {
    try {
      const verifyRefresh = await this.refreshLongService.verifyAsync(
        refreshToken,
      );
      return verifyRefresh;
    } catch (err) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }
  }

  public async login(email: string, password: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    const { password: passwordHash } = user;
    if (!passwordHash) {
      throw new InternalServerException("No password in User");
    }

    const isPasswordMatch = await bcrypt.compare(password, passwordHash);
    if (!isPasswordMatch) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }

    unset(user, "password");
    return user;
  }

  public async addRefreshTokenToUser(
    userId: string,
    refreshToken: RefreshToken,
  ): Promise<User> {
    const user = await this.userService.getById(userId);
    const { deviceUUID } = refreshToken;

    const refreshTokens = user.refreshTokens || [];
    remove(refreshTokens, { deviceUUID });
    refreshTokens.push(refreshToken);
    const res = await this.userService.patch(userId, { refreshTokens });
    return res;
  }

  public async generateJwtPayload(user: User): Promise<string> {
    const jwt = this.signJwtToken({
      userId: user.id,
    });

    return jwt;
  }

  public async validateUserByRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const userSearch: UserSearch = {
      and: [
        {
          id: [
            {
              operator: BasicOperator.Equal,
              values: [userId],
              isExactMatching: true,
              isCaseSensitive: true,
            },
          ],
        },
        {
          refreshTokens_token: [
            {
              operator: BasicOperator.Equal,
              values: [refreshToken],
              isExactMatching: true,
              isCaseSensitive: true,
            },
          ],
        },
      ],
    };

    const userApi = await this.userService.search(userSearch);
    if (!userApi.value?.length) {
      throw new ResultHandlerException(AuthErrors.invalidRefresh);
    }
    const [user] = userApi.value;
    return user;
  }
}
