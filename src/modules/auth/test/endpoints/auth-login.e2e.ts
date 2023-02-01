import {
  AccessModelCreate,
  AccessModelUsage,
  BasicOperator,
} from "@yest/yest-stats-api-typescript-fetch";
import { v4 } from "uuid";

import { DateUtil } from "../../../../utils/date.util";
import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authLoginTest(): void {
  let ctx: AuthContext;
  let userId: string;
  let userPublicId: string;
  let accessModelId: string;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.accessScopeService.init();
    const accessScopes = await ctx.accessScopeRepository.getAll();
    const accessScopeIds = accessScopes.map((x) => {
      return x.id;
    });

    // Creating an AccessModel
    const accessModelCreate: AccessModelCreate = {
      label: {
        translation: [{ text: "accessModel" }],
      },
      usage: AccessModelUsage.Both,
      accessScopeIds,
      isAssignable: true,
    };
    const accessModelCreateApi = await ctx.accessModelRepository.create(
      accessModelCreate,
    );
    accessModelId = accessModelCreateApi.id;

    userId = (await ctx.userRepository.create(ctx.userCreate)).id;
    userPublicId = (
      await ctx.userPublicRepository.create({
        ...ctx.userPublicCreate,
        userId,
      })
    ).id;
  });

  it("should login successfully and have a long refresh token", async () => {
    const deviceUUID = v4();

    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID,
      },
    });
    expect(res.isSuccess).toEqual(true);

    const userSearchApi = await ctx.userRepository.searchLogin({
      and: [
        {
          refreshTokens_token: [
            {
              operator: BasicOperator.Equal,
              values: [res.value!.refreshToken],
            },
          ],
        },
      ],
    });
    const [user] = userSearchApi.value!;
    const refreshToken = (user.refreshTokens || []).find((x) => {
      return x.deviceUUID === deviceUUID;
    })!;

    const expirationDate = new Date(refreshToken.exp);
    const oneYear = DateUtil.addToDate(DateUtil.newDate(), 1, "year");
    const inOneYearMinusOneDay = DateUtil.addToDate(oneYear, -1, "day");
    const inOneYearPlusOneDay = DateUtil.addToDate(oneYear, 1, "day");
    const isBetween = DateUtil.isBetween(
      expirationDate,
      inOneYearMinusOneDay,
      inOneYearPlusOneDay,
    );

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
    expect(res.value?.refreshToken).toBeDefined();
    expect(isBetween).toEqual(true);
  });

  it("should login successfully and have a short refresh token", async () => {
    const deviceUUID = v4();
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: false,
        deviceUUID,
      },
    });

    const loggedUserPublic = await ctx.userPublicRepository.getById(
      userPublicId,
    );
    const isLoggedRecent = DateUtil.isSameDay(
      loggedUserPublic.lastLoginAt!,
      new Date(),
    );
    expect(isLoggedRecent).toEqual(true);

    const userSearchApi = await ctx.userRepository.searchLogin({
      and: [
        {
          refreshTokens_token: [
            {
              operator: BasicOperator.Equal,
              values: [res.value!.refreshToken],
            },
          ],
        },
      ],
    });
    const [user] = userSearchApi.value!;
    const refreshToken = (user.refreshTokens || []).find((x) => {
      return x.deviceUUID === deviceUUID;
    })!;
    const expirationDate = new Date(refreshToken.exp);
    const newDate = DateUtil.newDate();
    const newDateMinusOneHour = DateUtil.addToDate(newDate, -1, "hour");
    const newDatePlusOneHour = DateUtil.addToDate(newDate, 1, "hour");
    const isBetween = DateUtil.isBetween(
      expirationDate,
      newDateMinusOneHour,
      newDatePlusOneHour,
    );

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
    expect(res.value?.refreshToken).toBeDefined();
    expect(isBetween).toEqual(true);
  });

  it("should fail to login", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555554",
        password: "password",
        rememberMe: true,
        deviceUUID: v4(),
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.invalidUser.httpCode);
    expect(res.error?.uuid).toEqual(AuthErrors.invalidUser.uuid);
  });

  it("should have no AccessScopes in the Jwt Token", async () => {
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    const { jwt } = res.value!;

    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes).toHaveLength(0);
    expect(decodedJwt.dealerUserId).not.toBeDefined();
  });

  it("should have AccessScopes in the Jwt Token", async () => {
    await ctx.userRepository.patch(userId, { accessModelId });
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    const { jwt } = res.value!;
    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes.length).toBeGreaterThan(0);
  });

  it("should replace the RefreshToken on a second login with the same UserAgent", async () => {
    const deviceUUID = v4();
    await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID,
      },
    });
    await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID,
      },
    });

    const user = await ctx.userRepository.getById(userId);

    expect(user.refreshTokens).toHaveLength(1);
  });
}
