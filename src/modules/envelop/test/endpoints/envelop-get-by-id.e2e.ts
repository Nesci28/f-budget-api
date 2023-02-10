import { Envelop } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EnvelopContext } from "../envelop.e2e-spec";
import { EnvelopErrors } from "../../../../../src/modules/envelop/envelop.errors";

export function envelopGetByIdTest(): void {
  let ctx: EnvelopContext;
  let envelops: Envelop[];

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    envelops = await ctx.envelopRepository.createMany(ctx.envelopCreates);
  });

  it("should return a specific Envelop", async () => {
    const results = await ctx.envelopConnector.envelopGetById({ id: envelops[0].id, envelopPopulateRequestBody: {} });

    expect(results.isSuccess).toEqual(true);
    expect(results.value?.id).toEqual(envelops[0].id);
  });

  it("should return not found when using an invalid Envelop id", async () => {
    const fakeEnvelopId = "61d88c918c8a0daafeafe31d";

    const results = await ctx.envelopConnector.envelopGetById({ id: fakeEnvelopId, envelopPopulateRequestBody: {} });

    expect(results.isSuccess).toEqual(false);
    expect(results.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(results.error?.uuid).toEqual(EnvelopErrors.notFound.uuid);
  });
}
