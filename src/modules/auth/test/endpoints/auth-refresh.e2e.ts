import * as sleep from "atomic-sleep";
import { v4 } from "uuid";

import { AuthErrors } from "../../auth.errors";
import { AuthContext } from "../auth.e2e-spec";

export function authRefreshTest(): void {
  let ctx: AuthContext;
  let refreshToken: string;

  beforeAll(async () => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    await ctx.userRepository.create(ctx.userCreate);
    const res = await ctx.authConnector.login({
      loginRequestBody: {
        email: "test@test.com",
        password: "password",
        rememberMe: true,
        deviceUUID: v4(),
      },
    });
    refreshToken = res.value!.refreshToken;
  });

  it("should login successfully with a RefreshToken", async () => {
    const res = await ctx.authConnector.refreshToken({
      headers: {
        refreshToken,
      },
    });

    expect(res.isSuccess).toEqual(true);
    expect(res.value?.jwt).toBeDefined();
  });

  it("should fail to login with a bad RefreshToken", async () => {
    const res = await ctx.authConnector.refreshToken({
      headers: {
        refreshToken: "refreshToken",
      },
    });

    expect(res.isSuccess).toEqual(false);
    expect(res.error?.httpCode).toEqual(AuthErrors.wrongCredentials.httpCode);
    expect(res.error?.uuid).toEqual("2680376a-c47c-4af7-8bca-0ebdca626ff5");
  });

  it("should refresh the expiration time in RefreshToken", async () => {
    const beforeDecodedRefreshToken =
      ctx.authService.decodeRefreshToken(refreshToken);

    sleep(1000);
    const res = await ctx.authConnector.refreshToken({
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
}
