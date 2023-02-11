import { Envelop } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EnvelopErrors } from "../../envelop.errors";
import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopPatchTest(): void {
  let ctx: EnvelopContext;
  let envelop: Envelop;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    envelop = await ctx.envelopRepository.create(ctx.envelopCreate);
  });

  it("should patch only the specified fields", async () => {
    const result = await ctx.envelopConnector.envelopPatch({
      id: envelop.id,
      envelopPatch: ctx.envelopPatch,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(envelop.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.envelopPatch,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to patch an archived Envelop", async () => {
    await ctx.envelopRepository.archive(envelop.id);

    const result = await ctx.envelopConnector.envelopPatch({
      id: envelop.id,
      envelopPatch: ctx.envelopPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EnvelopErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid envelop id", async () => {
    const fakeEnvelopId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.envelopConnector.envelopPatch({
      id: fakeEnvelopId,
      envelopPatch: ctx.envelopPatch,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EnvelopErrors.notFound.uuid);
  });
}
