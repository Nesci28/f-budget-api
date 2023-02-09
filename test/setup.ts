import { Configuration } from "@f-budget/f-budget-api-typescript-fetch";
import { MongoMemoryHandler } from "@yest/mongoose-test";
import { YestRouterModule } from "@yest/router";
import { SecurityService } from "@yest/security";
import { TestHandler } from "@yest/test";
import { cloneDeep, unset } from "lodash";
import mongoose from "mongoose";

import { AppModule, meta } from "../src/app.module";
import { configs } from "../src/constants/configs.constant";
import {
  Context,
  createMany,
  createOne,
  generateOptionIdMap,
  updateField,
} from "./global";

export default async (): Promise<void> => {
  const startBuildDate = new Date().getTime();
  console.log("Building test App");
  unset(globalThis, "context");
  globalThis.context = {} as Context<any, any>;
  globalThis.context.testHandler = new TestHandler();
  globalThis.context.mongoMemory = new MongoMemoryHandler();

  const clonedMeta = cloneDeep(meta);

  // Create the App
  const yestModuleRouter = YestRouterModule.forRoot({
    apiDoc: configs.resolvedPath,
    testMode: true,
    destroy$: globalThis.context.testHandler.destroy$,
  });
  clonedMeta.imports.push(
    globalThis.context.mongoMemory.setup(27028, configs.mongooseConnectionName),
    yestModuleRouter,
  );
  Reflect.defineMetadata("testMode", true, AppModule);
  await globalThis.context.testHandler.createApp(clonedMeta, {
    resolvedPath: configs.resolvedPath,
  });
  const endBuildDate = new Date().getTime();
  console.log(`App built in: ${endBuildDate - startBuildDate}ms`);

  const startSetupDate = new Date().getTime();
  // Fill CTX
  globalThis.context.securityService = (
    globalThis.context.testHandler as TestHandler
  ).get<SecurityService>(SecurityService);

  const jwtToken = globalThis.context.securityService.signJwtToken({
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  const config = new Configuration({
    headers: { authorization: `bearer ${jwtToken}` },
  });

  globalThis.context.jwtToken = jwtToken;
  globalThis.context.config = config;
  globalThis.context.createOne = createOne;
  globalThis.context.createMany = createMany;
  globalThis.context.updateField = updateField;
  globalThis.context.optionIdMap = generateOptionIdMap();
  globalThis.context.testHandler.optionIdMap = globalThis.context.optionIdMap;

  const endSetupDate = new Date().getTime();
  console.log(`Setup done in: ${endSetupDate - startSetupDate}ms`);
};
