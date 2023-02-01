import { User } from "@yest/yest-stats-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { UserErrors } from "../../user.errors";
import { UserContext } from "../user.e2e-spec";

export function userUpdateTest(): void {
  let ctx: UserContext;
  let user: User;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    user = await ctx.userRepository.create(ctx.userCreate);
  });

  it("should update the specified User", async () => {
    const result = await ctx.userConnector.userUpdate({
      id: user.id,
      userUpdate: ctx.userUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(user.id);
    const res = ctx.testHandler.traverseObjects(ctx.userUpdate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified User as dry-run (not saving)", async () => {
    const result = await ctx.userConnector.userUpdate({
      id: user.id,
      userUpdate: ctx.userUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.userRepository.getById(result.value!.id);
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.userUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(user.id);
    const res = ctx.testHandler.traverseObjects(ctx.userUpdate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived User", async () => {
    await ctx.userRepository.archive(user.id);

    const result = await ctx.userConnector.userUpdate({
      id: user.id,
      userUpdate: ctx.userUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(UserErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid User id", async () => {
    const fakeUserId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.userConnector.userUpdate({
      id: fakeUserId,
      userUpdate: ctx.userUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(UserErrors.notFound.uuid);
  });
}
