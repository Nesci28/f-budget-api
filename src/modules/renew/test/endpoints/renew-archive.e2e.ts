import { StatusCodes } from "http-status-codes";

import { RenewErrors } from "../../renew.errors";
import { RenewContext } from "../renew.e2e-spec";

export function renewArchiveTest(): void {
  let ctx: RenewContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Renew", async () => {
    const renew = await ctx.renewRepository.create(ctx.renewCreate);

    const result = await ctx.renewConnector.renewArchive({ id: renew.id });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Renew id", async () => {
    const fakeRenewId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.renewConnector.renewArchive({ id: fakeRenewId });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(RenewErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Renew", async () => {
    const renew = await ctx.renewRepository.create(ctx.renewCreate);
    await ctx.renewRepository.archive(renew.id);

    const result = await ctx.renewConnector.renewArchive({ id: renew.id });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(RenewErrors.alreadyArchived.uuid);
  });
}
