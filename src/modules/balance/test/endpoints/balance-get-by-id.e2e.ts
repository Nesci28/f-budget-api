import { Balance } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { BalanceErrors } from "../../balance.errors";
import { BalanceContext } from "../balance.e2e-spec";

export function balanceGetByIdTest(): void {
  let ctx: BalanceContext;
  let balances: Balance[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    balances = await ctx.balanceRepository.createMany(ctx.balanceCreates);
  });

  it("should return a specific Balance", async () => {
    const results = await ctx.balanceConnector.balanceGetById({
      id: balances[0].id,
      balancePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(balances[0].id);
  });

  it("should return not found when using an invalid Balance id", async () => {
    const fakeBalanceId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.balanceConnector.balanceGetById({
      id: fakeBalanceId,
      balancePopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(BalanceErrors.notFound.uuid);
  });
}
