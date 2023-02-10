import { Renew } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { RenewErrors } from "../../renew.errors";
import { RenewContext } from "../renew.e2e-spec";

export function renewPatchTest(): void {
  let ctx: RenewContext;
  let renew: Renew;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    renew = await ctx.renewRepository.create(ctx.renewCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.renewConnector.renewPatch({
      id: renew.id,
      renewPatch: ctx.renewPatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(renew.id);
    const res = ctx.testHandler.traverseObjects(ctx.renewPatch, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Renew", async () => {
    await ctx.renewRepository.archive(renew.id);

    const result = await ctx.renewConnector.renewPatch({
      id: renew.id,
      renewPatch: ctx.renewPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(RenewErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid renew id", async () => {
    const fakeRenewId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.renewConnector.renewPatch({
      id: fakeRenewId,
      renewPatch: ctx.renewPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(RenewErrors.notFound.uuid);
  });
}
