/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Endpoint,
  Module,
  Project,
} from "@yest/yest-stats-api-typescript-fetch";
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
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public projectId: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public name: string;

  @Prop({
    type: [Types.ObjectId],
    set: MongoUtil.setterObjectIds,
    get: MongoUtil.getterObjectIds,
  })
  public endpointIds?: string[];

  public endpoints?: Endpoint[];

  public project?: Project;
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

schema.virtual("project", {
  ref: () => {
    const model = getRefModel(connections, "MongoProject");
    return model;
  },
  localField: "projectId",
  foreignField: "id",
  autopopulate: false,
  justOne: true,

  get: MongoUtil.getterUnsetPopulate,
});

export const MongoModuleSchema = schema;
