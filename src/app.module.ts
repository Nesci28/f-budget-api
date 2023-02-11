import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER } from "@nestjs/core";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { YestHealthcheckModule } from "@yest/healthcheck";
import { YestMinioModule } from "@yest/minio";
import {
  InternalServerInterceptor,
  ResultHandlerInterceptor,
  ScopeInterceptor,
  YestRouterModule,
} from "@yest/router";
import { YestSecurityModule } from "@yest/security";
import * as Joi from "joi";
import { cloneDeep } from "lodash";
import { RequestContextModule } from "nestjs-request-context";
import { v4 } from "uuid";

import { configs } from "./constants/configs.constant";
import { LocalStrategy } from "./guards/local.strategy";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthService } from "./modules/auth/auth.service";
import { BalanceModule } from "./modules/balance/balance.module";
import { EnvelopModule } from "./modules/envelop/envelop.module";
import { ReceiptModule } from "./modules/receipt/receipt.module";
import { RenewModule } from "./modules/renew/renew.module";
import { UploadModule } from "./modules/upload/upload.module";
import { UserModule } from "./modules/user/user.module";

const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    CORS: Joi.string(),
    BODY_LIMIT_SIZE: Joi.string().required(),
    DEFAULT_EMAIL: Joi.string().required(),
    DEFAULT_PASSWORD: Joi.string().required(),
    JWT_PUBLIC_KEY: Joi.string().required(),
    JWT_PRIVATE_KEY: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    REFRESH_PUBLIC_KEY: Joi.string().required(),
    REFRESH_PRIVATE_KEY: Joi.string().required(),
    REFRESH_EXPIRATION_LONG: Joi.string().required(),
    REFRESH_EXPIRATION_SHORT: Joi.string().required(),
    MONGO_USERNAME: Joi.string().required(),
    MONGO_PASSWORD: Joi.string().required(),
    MONGO_URL_1: Joi.string().required(),
    MONGO_DB: Joi.string().required(),
  }),
});

const yestHealthcheckModule = YestHealthcheckModule.forRoot();

const yestRouterModule = YestRouterModule.forRoot({
  apiDoc: configs.resolvedPath,
});

const yestMinio = YestMinioModule.registerAsync();

const mongooseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: configs.mongooseConnectionName,
  useFactory: (configService: ConfigService): MongooseModuleOptions => {
    const username = configService.get("MONGO_USERNAME");
    const password = configService.get("MONGO_PASSWORD");
    const database = configService.get("MONGO_DB");
    const host1 = configService.get("MONGO_URL_1");
    const replicaSet = configService.get("MONGO_REPLICA_SET");
    const uri = `mongodb://${username}:${password}@${host1}`;

    return {
      uri,
      dbName: database,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      directConnection: true,
      replicaSet,
      authSource: "admin",
    };
  },
});

const throttlerModule = ThrottlerModule.forRoot({
  ttl: configs.throttlerTTL,
  limit: configs.throttlerLimit,
});

export const appImports = [
  configModule,
  RequestContextModule,
  YestSecurityModule.forRootAsync(YestSecurityModule, {
    imports: [AuthModule],
    inject: [AuthService],
    useFactory: (authService: AuthService) => {
      return {
        uuid: v4(),
        authService,
      };
    },
  }),
];

const moduleImports = [
  AuthModule,
  BalanceModule,
  EnvelopModule,
  ReceiptModule,
  RenewModule,
  UploadModule,
  UserModule,
];

const appProviders = [
  LocalStrategy,
  {
    provide: APP_FILTER,
    useClass: ResultHandlerInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: ScopeInterceptor,
  },
  {
    provide: APP_FILTER,
    useClass: InternalServerInterceptor,
  },
];

export const meta = {
  imports: [
    yestHealthcheckModule,
    yestMinio,
    ...appImports,
    ...moduleImports,
    throttlerModule,
  ],
  providers: [...appProviders],
};
const metaCloned = cloneDeep(meta);
metaCloned.imports.push(yestRouterModule, mongooseModule);

@Module(metaCloned)
export class AppModule {}
