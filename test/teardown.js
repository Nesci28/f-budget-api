const { unset } = require("lodash");

module.exports = async () => {
  await globalThis.context.testHandler.close();
  await globalThis.context.mongoMemory.stop();
  unset(globalThis, "context");
};
