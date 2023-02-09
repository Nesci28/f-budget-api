import { User } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { UserErrors } from "../../user.errors";
import { UserContext } from "../user.e2e-spec";

export function userGetByIdTest(): void {
  let ctx: UserContext;
  let users: User[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    users = await ctx.userRepository.createMany(ctx.userCreates);
  });

  it("should return a specific User", async () => {
    const results = await ctx.userConnector.userGetById({
      id: users[0].id,
      userPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(users[0].id);
  });

  it("should return not found when using an invalid User id", async () => {
    const fakeUserId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.userConnector.userGetById({
      id: fakeUserId,
      userPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(UserErrors.notFound.uuid);
  });
}
