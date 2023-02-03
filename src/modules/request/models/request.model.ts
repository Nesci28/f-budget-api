/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Endpoint,
  Project,
  Request,
} from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

export type RequestDocument = MongoRequest & Document<MongoRequest>;

@Schema({
  collection: "mongorequest",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoRequest extends MongoBase implements Request {
  @Prop({
    type: String,
    required: true,
  })
  public path: string;

  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public uuid: string;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public endpointId: string;

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
  })
  public payload?: string;

  @Prop({
    type: Number,
  })
  public payloadSize?: number;

  public endpoint?: Endpoint;

  public project?: Project;
}

const schema = SchemaFactory.createForClass(MongoRequest);
schema.pre("save", MongoRequest.preSave);
schema.pre("insertMany", MongoRequest.preInsertMany);

schema.virtual("endpoint", {
  ref: () => {
    const model = getRefModel(connections, "MongoEndpoint");
    return model;
  },
  localField: "endpointId",
  foreignField: "id",
  autopopulate: false,
  justOne: true,

  get: MongoUtil.getterUnsetPopulate,
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

export const MongoRequestSchema = schema;
