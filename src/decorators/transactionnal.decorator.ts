import { ResultHandlerException } from "@yest/router";
import mongoose from "mongoose";

export function Transactionnal(modelName: string): MethodDecorator {
  return (
    _: unknown,
    __: unknown,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign, func-names
    descriptor.value = async function (...args: []): Promise<any> {
      const connection = mongoose.connections.find((x) => {
        const keys = Object.keys(x.collections).map((k) => {
          return k.toLowerCase();
        });
        const { readyState } = x;
        return readyState === 1 && keys.includes(modelName.toLowerCase());
      });
      if (!connection) {
        throw new Error("Missing mongo connection");
      }

      const session = await connection.startSession();
      session.startTransaction();

      try {
        const result = await originalMethod.apply(this, args);
        await session.commitTransaction();
        session.endSession();
        return result;
      } catch (err) {
        await session.abortTransaction();
        session.endSession();

        const errParsed = JSON.parse(err.message);
        if (errParsed.resultHandler) {
          throw new ResultHandlerException(errParsed.resultHandler);
        }
        if (errParsed.err) {
          throw new Error(errParsed.err);
        }

        throw err;
      }
    };
  };
}
