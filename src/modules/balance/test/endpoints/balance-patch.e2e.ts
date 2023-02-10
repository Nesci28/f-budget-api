import { Balance } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BalanceErrors } from "../../balance.errors";
import { BalanceContext } from "../balance.e2e-spec";

export function balancePatchTest(): void {
  let ctx: BalanceContext;
  let balance: Balance;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    balance = await ctx.balanceRepository.create(ctx.balanceCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.balanceConnector.balancePatch({
      id: balance.id,
      balancePatch: ctx.balancePatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(balance.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.balancePatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Balance", async () => {
    await ctx.balanceRepository.archive(balance.id);

    const result = await ctx.balanceConnector.balancePatch({
      id: balance.id,
      balancePatch: ctx.balancePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BalanceErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid balance id", async () => {
    const fakeBalanceId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.balanceConnector.balancePatch({
      id: fakeBalanceId,
      balancePatch: ctx.balancePatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BalanceErrors.notFound.uuid);
  });
}
