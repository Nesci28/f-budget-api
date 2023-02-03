/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Endpoint,
  Project,
  Request,
  Response,
  ResponseStatus,
} from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

export type ResponseDocument = MongoResponse & Document<MongoResponse>;

@Schema({
  collection: "mongoresponse",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoResponse extends MongoBase implements Response {
  @Prop({
    type: String,
    required: true,
  })
  public path: string;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
  })
  public requestId: string;

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
  })
  public payload: string;

  @Prop({
    type: Number,
    required: true,
  })
  public payloadSize: number;

  @Prop({
    type: Number,
    required: true,
  })
  public time: number;

  @Prop({
    type: Number,
    required: true,
    index: true,
    enum: ["500", "429", "404", "401", "400"],
  })
  public status: ResponseStatus;

  @Prop({
    type: String,
    required: true,
  })
  public uuid: string;

  @Prop({
    type: String,
  })
  public error?: string;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public endpointId: string;

  public request?: Request;

  public project?: Project;

  public endpoint?: Endpoint;
}

const schema = SchemaFactory.createForClass(MongoResponse);
schema.pre("save", MongoResponse.preSave);
schema.pre("insertMany", MongoResponse.preInsertMany);

schema.virtual("request", {
  ref: () => {
    const model = getRefModel(connections, "MongoRequest");
    return model;
  },
  localField: "requestId",
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

export const MongoResponseSchema = schema;
