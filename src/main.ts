import { Logger } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import * as express from "express";
import helmet from "helmet";
import * as morgan from "morgan";

import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("main");

  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsUrl = configService.get("CORS") || "*";
  const port = configService.get("API_PORT") || 3000;
  const bodyLimitSize = configService.get("BODY_LIMIT_SIZE") || 5;
  const corsConfig: CorsOptions = {
    origin: corsUrl,
    methods: "GET,HEAD,PATCH,POST,DELETE,OPTIONS,PUT",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: false,
    }),
  );
  app.enableCors(corsConfig);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ limit: `${bodyLimitSize}` }));
  const isDebugMode = configService.get("DEBUG_MODE");
  if (isDebugMode) {
    app.use(morgan("tiny"));
  }

  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);

}
bootstrap();
