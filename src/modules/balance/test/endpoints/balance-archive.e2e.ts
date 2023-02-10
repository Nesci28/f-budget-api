import { StatusCodes } from "http-status-codes";

import { BalanceErrors } from "../../balance.errors";
import { BalanceContext } from "../balance.e2e-spec";

export function balanceArchiveTest(): void {
  let ctx: BalanceContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Balance", async () => {
    const balance = await ctx.balanceRepository.create(ctx.balanceCreate);

    const result = await ctx.balanceConnector.balanceArchive({
      id: balance.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Balance id", async () => {
    const fakeBalanceId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.balanceConnector.balanceArchive({
      id: fakeBalanceId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(BalanceErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Balance", async () => {
    const balance = await ctx.balanceRepository.create(ctx.balanceCreate);
    await ctx.balanceRepository.archive(balance.id);

    const result = await ctx.balanceConnector.balanceArchive({
      id: balance.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(BalanceErrors.alreadyArchived.uuid);
  });
}
