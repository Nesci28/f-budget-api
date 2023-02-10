import { Renew } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { RenewErrors } from "../../renew.errors";
import { RenewContext } from "../renew.e2e-spec";

export function renewGetByIdTest(): void {
  let ctx: RenewContext;
  let renews: Renew[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    renews = await ctx.renewRepository.createMany(ctx.renewCreates);
  });

  it("should return a specific Renew", async () => {
    const results = await ctx.renewConnector.renewGetById({
      id: renews[0].id,
      renewPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(renews[0].id);
  });

  it("should return not found when using an invalid Renew id", async () => {
    const fakeRenewId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.renewConnector.renewGetById({
      id: fakeRenewId,
      renewPopulateRequestBody: {},
    });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(RenewErrors.notFound.uuid);
  });
}
