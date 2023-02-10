import { Balance } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BalanceErrors } from "../../balance.errors";
import { BalanceContext } from "../balance.e2e-spec";

export function balanceUpdateTest(): void {
  let ctx: BalanceContext;
  let balance: Balance;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    balance = await ctx.balanceRepository.create(ctx.balanceCreate);
  });

  it("should update the specified Balance", async () => {
    const result = await ctx.balanceConnector.balanceUpdate({
      id: balance.id,
      balanceUpdate: ctx.balanceUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(balance.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.balanceUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Balance as dry-run (not saving)", async () => {
    const result = await ctx.balanceConnector.balanceUpdate({
      id: balance.id,
      balanceUpdate: ctx.balanceUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.balanceRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.balanceUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(balance.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.balanceUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Balance", async () => {
    await ctx.balanceRepository.archive(balance.id);

    const result = await ctx.balanceConnector.balanceUpdate({
      id: balance.id,
      balanceUpdate: ctx.balanceUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BalanceErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Balance id", async () => {
    const fakeBalanceId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.balanceConnector.balanceUpdate({
      id: fakeBalanceId,
      balanceUpdate: ctx.balanceUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BalanceErrors.notFound.uuid);
  });
}
