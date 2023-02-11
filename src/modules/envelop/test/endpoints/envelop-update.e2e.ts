import { Envelop } from "@f-budget/f-budget-api-typescript-fetch";
import { StatusCodes } from "http-status-codes";

import { EnvelopErrors } from "../../envelop.errors";
import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopUpdateTest(): void {
  let ctx: EnvelopContext;
  let envelop: Envelop;

  beforeAll(() => {
    ctx = this.ctx;
  });

  beforeEach(async () => {
    envelop = await ctx.envelopRepository.create(ctx.envelopCreate);
  });

  it("should update the specified Envelop", async () => {
    const result = await ctx.envelopConnector.envelopUpdate({
      id: envelop.id,
      envelopUpdate: ctx.envelopUpdate,
    });

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(envelop.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.envelopUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should update the specified Envelop as dry-run (not saving)", async () => {
    const result = await ctx.envelopConnector.envelopUpdate({
      id: envelop.id,
      envelopUpdate: ctx.envelopUpdate,
      isDryRun: true,
    });

    const checkFindResult = await ctx.envelopRepository.getById(
      result.value!.id,
    );
    const checkRes = ctx.testHandler.traverseObjects(
      ctx.envelopUpdate,
      checkFindResult,
    );
    expect(
      checkRes.some((x) => {
        return !x.result;
      }),
    ).toEqual(true);

    expect(result.isSuccess).toEqual(true);
    expect(result.value!.id).toEqual(envelop.id);
    const res = ctx.testHandler.traverseObjects(
      ctx.envelopUpdate,
      result.value!,
    );
    const fail = res.find((x) => {
      return !x.result;
    });
    expect(fail).toBeUndefined();
  });

  it("should throw a bad request when trying to update an archived Envelop", async () => {
    await ctx.envelopRepository.archive(envelop.id);

    const result = await ctx.envelopConnector.envelopUpdate({
      id: envelop.id,
      envelopUpdate: ctx.envelopUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EnvelopErrors.alreadyArchived.uuid);
  });

  it("should return not found when using an invalid Envelop id", async () => {
    const fakeEnvelopId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.envelopConnector.envelopUpdate({
      id: fakeEnvelopId,
      envelopUpdate: ctx.envelopUpdate,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EnvelopErrors.notFound.uuid);
  });
}
