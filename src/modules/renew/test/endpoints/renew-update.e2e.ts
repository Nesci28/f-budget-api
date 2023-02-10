import { Renew } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { RenewErrors } from "../../renew.errors";
import { RenewContext } from "../renew.e2e-spec";

export function renewUpdateTest(): void {
  let ctx: RenewContext;
  let renew: Renew;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    renew = await ctx.renewRepository.create(ctx.renewCreate);
  });

  it("should update the specified Renew", async () => {
    const result = await ctx.renewConnector.renewUpdate({
      id: renew.id,
      renewUpdate: ctx.renewUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(renew.id);
    const res = ctx.testHandler.traverseObjects(ctx.renewUpdate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Renew as dry-run (not saving)", async () => {
    const result = await ctx.renewConnector.renewUpdate({
      id: renew.id,
      renewUpdate: ctx.renewUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.renewRepository.getById(result.value!.id);
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.renewUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(renew.id);
    const res = ctx.testHandler.traverseObjects(ctx.renewUpdate, result.value!);
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Renew", async () => {
    await ctx.renewRepository.archive(renew.id);

    const result = await ctx.renewConnector.renewUpdate({
      id: renew.id,
      renewUpdate: ctx.renewUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(RenewErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Renew id", async () => {
    const fakeRenewId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.renewConnector.renewUpdate({
      id: fakeRenewId,
      renewUpdate: ctx.renewUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(RenewErrors.notFound.uuid);
  });
}
