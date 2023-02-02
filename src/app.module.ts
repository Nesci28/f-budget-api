import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { YestHealthcheckModule } from "@yest/healthcheck";
import {
  InternalServerInterceptor,
  ResultHandlerInterceptor,
  ScopeInterceptor,
  YestRouterModule,
} from "@yest/router";
import { YestSecurityModule } from "@yest/security";
import Redis from "ioredis";
import * as Joi from "joi";
import { cloneDeep } from "lodash";
import { RequestContextModule } from "nestjs-request-context";
import { ThrottlerStorageRedisService } from "nestjs-throttler-storage-redis";
import { v4 } from "uuid";

import { configs } from "./constants/configs.constant";
import { IpsGuard } from "./guards/ip.guard";
import { LocalStrategy } from "./guards/local.strategy";
import { AuthModule } from "./modules/auth/auth.module";
import { AuthService } from "./modules/auth/auth.service";
import { EndpointModule } from "./modules/endpoint/endpoint.module";
import { ModuleModule } from "./modules/module/module.module";
import { ProjectModule } from "./modules/project/project.module";
import { RequestModule } from "./modules/request/request.module";
import { ResponseModule } from "./modules/response/response.module";
import { UserModule } from "./modules/user/user.module";

const configModule = ConfigModule.forRoot({
  validationSchema: Joi.object({
    CORS: Joi.string(),
    BODY_LIMIT_SIZE: Joi.string().required(),
    BASE_URL: Joi.string().required(),
    DEFAULT_EMAIL: Joi.string().required(),
    DEFAULT_PASSWORD: Joi.string().required(),
    JWT_PUBLIC_KEY: Joi.string().required(),
    JWT_PRIVATE_KEY: Joi.string().required(),
    JWT_EXPIRATION: Joi.string().required(),
    REFRESH_PUBLIC_KEY: Joi.string().required(),
    REFRESH_PRIVATE_KEY: Joi.string().required(),
    REFRESH_EXPIRATION_LONG: Joi.string().required(),
    REFRESH_EXPIRATION_SHORT: Joi.string().required(),
    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),
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

const mongooseModule = MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  connectionName: configs.mongooseConnectionName,
  useFactory: (configService: ConfigService): MongooseModuleOptions => {
    const username = configService.get("MONGO_USERNAME");
    const password = configService.get("MONGO_PASSWORD");
    const database = configService.get("MONGO_DB");
    const host1 = configService.get("MONGO_URL_1");
    // const host2 = configService.get("MONGO_URL_2");
    // const host3 = configService.get("MONGO_URL_3");
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

const throttlerModule = ThrottlerModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const host = config.get("REDIS_HOST");
    const port = config.get("REDIS_PORT");

    return {
      storage: new ThrottlerStorageRedisService(
        new Redis({
          db: configs.redisThrottlerDb,
          port,
          host,
        }),
      ),
    };
  },
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
  EndpointModule,
  ModuleModule,
  ProjectModule,
  RequestModule,
  ResponseModule,
  UserModule,
];

const appProviders = [
  LocalStrategy,
  {
    provide: APP_GUARD,
    useClass: IpsGuard,
  },
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
