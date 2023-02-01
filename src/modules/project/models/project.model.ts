/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { Module, Project } from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

export type ProjectDocument = MongoProject & Document<MongoProject>;

@Schema({
  collection: "mongoproject",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoProject extends MongoBase implements Project {
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
  public moduleIds?: string[];

  @Prop({
    type: String,
  })
  public logo?: string;

  public modules?: Module[];
}

const schema = SchemaFactory.createForClass(MongoProject);
schema.pre("save", MongoProject.preSave);
schema.pre("insertMany", MongoProject.preInsertMany);

schema.virtual("modules", {
  ref: () => {
    const model = getRefModel(connections, "MongoModule");
    return model;
  },
  localField: "moduleIds",
  foreignField: "id",
  autopopulate: false,
  justOne: false,

  get: MongoUtil.getterUnsetPopulates,
});

export const MongoProjectSchema = schema;
