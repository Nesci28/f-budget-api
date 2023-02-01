import {
  AccessModelCreate,
  AccessModelUsage,
  AccessScope,
  AccessScopeOverrideCreate,
  Announcer,
  DealerCreate,
  DealerUserCreate,
  DealerUserSettingCreate,
  Dms,
  ExtensionModule,
} from "@yest/yest-stats-api-typescript-fetch";
import * as sleep from "atomic-sleep";
import mongoose from "mongoose";
import { v4 } from "uuid";

import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authRefreshTest(): void {
  let ctx: AuthContext;
  let refreshToken: string;
  let userId: string;
  let dealerUserId: string;
  let dealerId: string;
  let accessModelId: string;
  let accessScopeIds: string[];
  let amountOfAccessScopeWithoutCRM: number;
  let accessScopes: AccessScope[];

  beforeAll(async () => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.accessScopeService.init();
    accessScopes = await ctx.accessScopeRepository.getAll();
    accessScopeIds = accessScopes.map((x) => {
      return x.id;
    });
    const revokedAccessScopeIds = accessScopes
      .filter((x) => {
        return x.extensionModules.includes(ExtensionModule.Crm);
      })
      .map((x) => {
        return x.id;
      });
    amountOfAccessScopeWithoutCRM =
      accessScopeIds.length - revokedAccessScopeIds.length;

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
    await ctx.userPublicRepository.create({ ...ctx.userPublicCreate, userId });
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    refreshToken = res.value!.refreshToken;
  });

  it("should login successfully with a RefreshToken", async () => {
    const res = await ctx.authConnector.refreshToken(undefined, {
      headers: {
        refreshToken,
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
  });

  it("should fail to login with a bad RefreshToken", async () => {
    const res = await ctx.authConnector.refreshToken(undefined, {
      headers: {
        refreshToken: "refreshToken",
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.wrongCredentials.httpCode);
    expect(res.error?.uuid).toEqual("2680376a-c47c-4af7-8bca-0ebdca626ff5");
  });

  it("should have no AccessScopes in the Jwt Token", async () => {
    const res = await ctx.authConnector.refreshToken(undefined, {
      headers: {
        refreshToken,
      },
    });
    const { jwt } = res.value!;

    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes).toHaveLength(0);
    expect(decodedJwt.dealerUserId).not.toBeDefined();
  });

  it("should refresh the expiration time in RefreshToken", async () => {
    const beforeDecodedRefreshToken =
      ctx.authService.decodeRefreshToken(refreshToken);

    sleep(1000);
    const res = await ctx.authConnector.refreshToken(undefined, {
      headers: {
        refreshToken,
      },
    });
    const afterDecodedRefreshToken = ctx.authService.decodeRefreshToken(
      res.value!.refreshToken!,
    );

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
    expect(res.value?.refreshToken).toBeDefined();
    expect(beforeDecodedRefreshToken.exp).toBeLessThan(
      afterDecodedRefreshToken.exp,
    );
  });

  it("should have AccessScopes in the Jwt Token", async () => {
    await ctx.userRepository.patch(userId, { accessModelId });
    const loginApi = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        dealerUserId,
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    const { refreshToken: rToken } = loginApi.value!;

    const res = await ctx.authConnector.refreshToken(
      {
        id: dealerUserId,
      },
      {
        headers: {
          refreshtoken: rToken,
        },
      },
    );

    const { jwt } = res.value!;
    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes.length).toBeGreaterThan(0);
    expect(decodedJwt.dealerUserId).toEqual(dealerUserId);
  });

  it("should revoked the AccessScopes in the Jwt Token if the dealer has the ExtensionModule to blocked", async () => {
    // Creating AccessScopeOverrides
    const accessScopeOverrideCreates: AccessScopeOverrideCreate[] = Object.keys(
      ExtensionModule,
    ).map((e, i) => {
      const extensionModule = ExtensionModule[e];
      return {
        label: { translation: [{ text: i.toString() }] },
        accessScopeIds,
        extensionModule,
      };
    });
    await ctx.accessScopeOverrideRepository.createMany(
      accessScopeOverrideCreates,
    );

    // Creating a Dealer
    const dealerCreate: DealerCreate = {
      name: { translation: [{ text: "dealerName" }] },
      vehicleManufacturerId: new mongoose.Types.ObjectId().toHexString(),
      resourceInfos: [
        {
          firstName: "firstName",
          lastName: "lastName",
          officePhoneNumber: "5555555555",
        },
      ],
      moduleSetting: {
        evaluation: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
        },
        crm: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: false,
          accessScopeOverrideIds: [],
        },
        inventory: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
          dmsIdentifier: "1",
          announcerIdentifier: "1",
          dms: Dms.Serti,
          announcer: Announcer.D2C,
        },
        leads: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
        },
        intellitaux: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
        },
        marketAnalysis: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
        },
        tires: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
        },
        sales: {
          monthlyFee: 0,
          activationFee: 0,
          isActive: true,
          accessScopeOverrideIds: [],
          dmsIdentifier: "1",
          dms: Dms.Serti,
        },
      },
      addressInfo: {
        address: "123 test",
        city: "city",
        province: "province",
        country: "country",
        postalCode: "g1g1g1",
      },
    };
    const dealerCreated = await ctx.dealerRepository.create(dealerCreate);
    dealerId = dealerCreated.id;

    // Creating a DealerUser
    const dealerUserCreate: DealerUserCreate = {
      dealerId,
      userId,
      isBlocked: false,
    };
    dealerUserId = (await ctx.dealerUserRepository.create(dealerUserCreate)).id;
    const dealerUserSettingCreate: DealerUserSettingCreate = {
      dealerUserId,
      accessModelId,
      info: {
        email: "email@email.com",
        officePhoneNumber: "5555555551",
        jobId: ctx.testHandler.optionIdMap!.translatableText!,
        departmentId: ctx.testHandler.optionIdMap!.translatableText!,
      },
    };
    await ctx.dealerUserSettingRepository.create(dealerUserSettingCreate);

    const loginApi = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        dealerUserId,
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    const { refreshToken: rToken } = loginApi.value!;

    const res = await ctx.authConnector.refreshToken(
      {
        id: dealerUserId,
      },
      {
        headers: {
          refreshtoken: rToken,
        },
      },
    );

    const { jwt } = res.value!;
    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes.length).toEqual(
      amountOfAccessScopeWithoutCRM,
    );
    expect(decodedJwt.dealerUserId).toEqual(dealerUserId);
  });

  // Skipped: Forgot what this is supposed to do
  it.skip("should revoked the AccessScopes in the Jwt Token if the dealer has the ExtensionModule but does not have the overrideId", async () => {
    let total = 0;
    // Creating AccessScopeOverrides
    const accessScopeOverrideCreates: AccessScopeOverrideCreate[] = Object.keys(
      ExtensionModule,
    ).map((e, i) => {
      const extensionModule = ExtensionModule[e];
      const accessScopesFiltered = accessScopes.filter((x) => {
        return x.extensionModules.includes(extensionModule);
      });
      const accessScopeIdsFiltered = accessScopesFiltered.length
        ? [accessScopesFiltered[i].id]
        : [];
      if (accessScopeIdsFiltered.length) {
        total += 1;
      }
      return {
        label: { translation: [{ text: i.toString() }] },
        accessScopeIds: accessScopeIdsFiltered,
        extensionModule,
      };
    });
    await ctx.accessScopeOverrideRepository.createMany(
      accessScopeOverrideCreates,
    );

    // Creating a Dealer
    const dealerCreate: DealerCreate = {
      name: { translation: [{ text: "dealerName" }] },
      vehicleManufacturerId: new mongoose.Types.ObjectId().toHexString(),
      resourceInfos: [
        {
          firstName: "firstName",
          lastName: "lastName",
          officePhoneNumber: "5555555555",
        },
      ],
      // moduleSetting: Object.keys(ExtensionModule).reduce((accu, curr) => {
      //   const accessScopeOverrideId = accessScopeOverridesCreated.find((a) => {
      //     return a.extensionModule === curr;
      //   })!.id;
      //   return {
      //     monthlyFee: 1,
      //     activationFee: 1,
      //     isActive: true,
      //     accessScopeOverrideIds: [accessScopeOverrideId],
      //     extensionModule: ExtensionModule[x],
      //   };
      // }),
      moduleSetting: {},
      addressInfo: {
        address: "123 test",
        city: "city",
        province: "province",
        country: "country",
        postalCode: "g1g1g1",
      },
    };
    const dealerCreated = await ctx.dealerRepository.create(dealerCreate);
    dealerId = dealerCreated.id;

    // Creating a DealerUser
    const dealerUserCreate: DealerUserCreate = {
      dealerId,
      userId,
      isBlocked: false,
    };
    dealerUserId = (await ctx.dealerUserRepository.create(dealerUserCreate)).id;
    const dealerUserSettingCreate: DealerUserSettingCreate = {
      dealerUserId,
      accessModelId,
      info: {
        email: "email@email.com",
        officePhoneNumber: "5555555551",
        jobId: ctx.testHandler.optionIdMap!.translatableText!,
        departmentId: ctx.testHandler.optionIdMap!.translatableText!,
      },
    };
    await ctx.dealerUserSettingRepository.create(dealerUserSettingCreate);

    const loginApi = await ctx.authConnector.login({
      loginRequestBody: {
        phoneNumber: "5555555555",
        password: "password",
        dealerUserId,
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    const { refreshToken: rToken } = loginApi.value!;

    const res = await ctx.authConnector.refreshToken(
      {
        id: dealerUserId,
      },
      {
        headers: {
          refreshtoken: rToken,
        },
      },
    );

    const { jwt } = res.value!;
    const decodedJwt = ctx.authService.decodeJwtToken(jwt);

    const accessScopeWithoutExtensionModules = accessScopes.filter((x) => {
      return !x.extensionModules.length;
    }).length;
    const totalAccessScopesLength = accessScopeWithoutExtensionModules + total;

    expect(decodedJwt.userId).toEqual(userId);
    expect(decodedJwt.accessScopes.length).toEqual(totalAccessScopesLength);
    expect(decodedJwt.dealerUserId).toEqual(dealerUserId);
  });
}
