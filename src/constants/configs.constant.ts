import * as appRoot from "app-root-path";
import * as ms from "ms";

export const configs = {
  appRoot,
  resolvedPath: `${appRoot}/src/definitions/resolved-deep.yaml`,
  refreshExpirationLongMS: ms(process.env.REFRESH_EXPIRATION_LONG),
  refreshExpirationShortMS: ms(process.env.REFRESH_EXPIRATION_SHORT),
  throttlerTTL: 60,
  throttlerLoginLimit: 5,
  redisThrottlerDb: 1,
  mongooseConnectionName: "yest-stats",
  bcryptRound: 12,
};