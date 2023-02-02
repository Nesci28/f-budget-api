import {
  AuthApi,
  UserCreate,
  UserRole,
} from "@yest/yest-stats-api-typescript-fetch";

import { cleanDbs, Context } from "../../../../test/global";
import { UserRepository } from "../../user/user.repository";
import { AuthService } from "../auth.service";
import { authLoginTest } from "./endpoints/auth-login.e2e";
import { authRefreshTest } from "./endpoints/auth-refresh.e2e";

export interface AuthContext extends Context<never, never> {
  authConnector: AuthApi;
  authService: AuthService;
  userCreate: UserCreate;
  userRepository: UserRepository;
}

describe("AuthController", () => {
  const ctx = globalThis.context as AuthContext;

  beforeAll(async () => {
    ctx.authConnector = ctx.testHandler.prepareConnector(AuthApi);
    ctx.authService = ctx.testHandler.get("AuthService");
    ctx.userRepository = ctx.testHandler.get("UserRepository");

    ctx.userCreate = {
      email: "test@test.com",
      password: "password",
      role: UserRole.Admin,
    };
  });

  beforeEach(async () => {
    await cleanDbs(ctx);
    jest.restoreAllMocks();
  });

  describe("Auth login", authLoginTest.bind({ ctx }));
  describe("Auth refresh", authRefreshTest.bind({ ctx }));
});
