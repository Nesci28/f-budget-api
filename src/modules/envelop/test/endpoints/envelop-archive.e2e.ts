import { StatusCodes } from "http-status-codes";

import { EnvelopErrors } from "../../envelop.errors";
import { EnvelopContext } from "../envelop.e2e-spec";

export function envelopArchiveTest(): void {
  let ctx: EnvelopContext;

  beforeAll(() => {
    ctx = this.ctx;
  });

  it("should archive the specified Envelop", async () => {
    const envelop = await ctx.envelopRepository.create(ctx.envelopCreate);

    const result = await ctx.envelopConnector.envelopArchive({
      id: envelop.id,
    });

    expect(result.isSuccess).toEqual(true);
  });

  it("should return not found when using an invalid Envelop id", async () => {
    const fakeEnvelopId = "61d88c918c8a0daafeafe31d";

    const result = await ctx.envelopConnector.envelopArchive({
      id: fakeEnvelopId,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.NOT_FOUND);
    expect(result.error?.uuid).toEqual(EnvelopErrors.notFound.uuid);
  });

  it("should throw a bad request when trying to archive an archived Envelop", async () => {
    const envelop = await ctx.envelopRepository.create(ctx.envelopCreate);
    await ctx.envelopRepository.archive(envelop.id);

    const result = await ctx.envelopConnector.envelopArchive({
      id: envelop.id,
    });

    expect(result.isSuccess).toEqual(false);
    expect(result.error?.httpCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(result.error?.uuid).toEqual(EnvelopErrors.alreadyArchived.uuid);
  });
}
