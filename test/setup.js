const { MongoMemoryHandler } = require("@yest/mongoose-test");
const { YestRouterModule } = require("@yest/router");
const { SecurityService } = require("@yest/security");
const { TestHandler } = require("@yest/test");
const { cloneDeep, unset } = require("lodash");
const mongoose = require("mongoose");

const { Configuration } = require("@f-budget/f-budget-api-typescript-fetch");
const { AppModule, meta } = require("../src/app.module");
const { configs } = require("../src/constants/configs.constant");

const {
  createMany,
  createOne,
  generateOptionIdMap,
  updateField,
} = require("./global");

module.exports = async () => {
  const startBuildDate = new Date().getTime();
  console.log("Building test App");
  unset(globalThis, "context");
  globalThis.context = {};
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
  globalThis.context.securityService =
    globalThis.context.testHandler.get(SecurityService);

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

  const endSetupDate = new Date().getTime();
  console.log(`Setup done in: ${endSetupDate - startSetupDate}ms`);
};
