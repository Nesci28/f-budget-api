import * as appRoot from "app-root-path";
import * as ms from "ms";

export const configs = {
  appRoot,
  resolvedPath: `${appRoot}/src/definitions/resolved-deep.yaml`,
  refreshExpirationLongMS: ms(process.env.REFRESH_EXPIRATION_LONG),
  refreshExpirationShortMS: ms(process.env.REFRESH_EXPIRATION_SHORT),
  throttlerTTL: 60,
  throttlerLimit: 100,
  throttlerLoginLimit: 5,
  redisThrottlerDb: 1,
  redisBullDb: 2,
  mongooseConnectionName: "f-budget",
  bcryptRound: 12,
};
