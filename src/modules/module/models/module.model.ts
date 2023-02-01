/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { Endpoint, Module } from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

export type ModuleDocument = MongoModule & Document<MongoModule>;

@Schema({
  collection: "mongomodule",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoModule extends MongoBase implements Module {
  @Prop({
    type: String,
    required: true,
  })
  public name: string;

  @Prop({
    type: [Types.ObjectId],
    set: MongoUtil.setterObjectIds,
    get: MongoUtil.getterObjectIds,
  })
  public endpointIds?: string[];

  public endpoints?: Endpoint[];
}

const schema = SchemaFactory.createForClass(MongoModule);
schema.pre("save", MongoModule.preSave);
schema.pre("insertMany", MongoModule.preInsertMany);

schema.virtual("endpoints", {
  ref: () => {
    const model = getRefModel(connections, "MongoEndpoint");
    return model;
  },
  localField: "endpointIds",
  foreignField: "id",
  autopopulate: false,
  justOne: false,

  get: MongoUtil.getterUnsetPopulates,
});

export const MongoModuleSchema = schema;
