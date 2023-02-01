import {
  AccessModelRepository,
  AccessScopeRepository,
  AccessScopeService as YestAccessScopeService,
} from "@yest/mongoose";
import {
  AuthApi,
  UserCreate,
  UserPublicCreate,
  UserRole,
} from "@yest/yest-stats-api-typescript-fetch";
import * as bcrypt from "bcrypt";
import mongoose from "mongoose";

import { cleanDbs, Context } from "../../../../test/global";
import { AccessScopeService } from "../../../services/access-scope/access-scope.service";
import { ExternalNotificationService } from "../../../services/external-notification/external-notification.service";
import { AccessScopeOverrideRepository } from "../../access-scope-override/access-scope-override.repository";
import { DealerRepository } from "../../dealer/dealer.repository";
import { DealerUserRepository } from "../../dealer-user/dealer-user.repository";
import { DealerUserSettingRepository } from "../../dealer-user-setting/dealer-user-setting.repository";
import { PhoneNumberTokenRepository } from "../../phone-number-token/phone-number-token.repository";
import { UserRepository } from "../../user/user.repository";
import { UserPublicRepository } from "../../user-public/user-public.repository";
import { AuthService } from "../auth.service";
import { authForgotPasswordTest } from "./endpoints/auth-forgot.e2e";
import { authLoginTest } from "./endpoints/auth-login.e2e";
import { authRefreshTest } from "./endpoints/auth-refresh.e2e";
import { authResetPasswordTest } from "./endpoints/auth-reset.e2e";

export interface AuthContext extends Context<never, never> {
  authConnector: AuthApi;
  authService: AuthService;
  phoneNumberTokenRepository: PhoneNumberTokenRepository;
  userCreate: UserCreate;
  userPublicCreate: UserPublicCreate;
  userRepository: UserRepository;
  userPublicRepository: UserPublicRepository;
  accessScopeService: AccessScopeService;
  accessScopeRepository: AccessScopeRepository;
  accessModelRepository: AccessModelRepository;
  dealerUserRepository: DealerUserRepository;
  dealerUserSettingRepository: DealerUserSettingRepository;
  externalNotificationService: ExternalNotificationService;
  yestAccessScopeService: YestAccessScopeService;
  dealerRepository: DealerRepository;
  accessScopeOverrideRepository: AccessScopeOverrideRepository;
}

describe("AuthController", () => {
  const ctx = globalThis.context as AuthContext;

  beforeAll(async () => {
    ctx.authConnector = ctx.testHandler.prepareConnector(AuthApi);
    ctx.phoneNumberTokenRepository = ctx.testHandler.get(
      "PhoneNumberTokenRepository",
    );
    ctx.authService = ctx.testHandler.get("AuthService");
    ctx.userRepository = ctx.testHandler.get("UserRepository");
    ctx.userPublicRepository = ctx.testHandler.get("UserPublicRepository");
    ctx.yestAccessScopeService = ctx.testHandler.get("YestAccessScopeService");
    ctx.accessScopeRepository = ctx.testHandler.get(
      "YestAccessScopeRepository",
    );
    ctx.accessModelRepository = ctx.testHandler.get("AccessModelRepository");
    ctx.dealerUserRepository = ctx.testHandler.get("DealerUserRepository");
    ctx.dealerUserSettingRepository = ctx.testHandler.get(
      "DealerUserSettingRepository",
    );
    ctx.externalNotificationService = ctx.testHandler.get(
      "ExternalNotificationService",
    );
    ctx.accessScopeService = ctx.testHandler.get("AccessScopeService");
    ctx.dealerRepository = ctx.testHandler.get("DealerRepository");
    ctx.accessScopeOverrideRepository = ctx.testHandler.get(
      "AccessScopeOverrideRepository",
    );

    const password = bcrypt.hashSync("password", 10);
    ctx.userCreate = {
      password,
      accessModelId: new mongoose.Types.ObjectId().toHexString(),
      roles: [UserRole.Member],
      notificationPreference: {
        sms: false,
        email: false,
      },
    };
    ctx.userPublicCreate = {
      userId: "changeMe",
      firstName: "firstName",
      lastName: "lastName",
      phoneNumber: "5555555555",
      lastLoginAt: new Date("1900-12-12"),
      isInvitationWanted: false,
    };
  });

  beforeEach(async () => {
    await cleanDbs(ctx);
    jest.restoreAllMocks();
  });

  describe("Auth login", authLoginTest.bind({ ctx }));
  describe("Auth refresh", authRefreshTest.bind({ ctx }));
  describe("Auth forgot password", authForgotPasswordTest.bind({ ctx }));
  describe("Auth reset password", authResetPasswordTest.bind({ ctx }));
});
