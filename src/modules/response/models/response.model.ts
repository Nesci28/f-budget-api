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
    enum: [
      "100",
      "101",
      "102",
      "200",
      "201",
      "202",
      "203",
      "204",
      "205",
      "206",
      "207",
      "208",
      "226",
      "300",
      "301",
      "302",
      "303",
      "304",
      "305",
      "306",
      "307",
      "308",
      "400",
      "401",
      "402",
      "403",
      "404",
      "405",
      "406",
      "407",
      "408",
      "409",
      "410",
      "411",
      "412",
      "413",
      "414",
      "415",
      "416",
      "417",
      "418",
      "421",
      "422",
      "423",
      "424",
      "426",
      "428",
      "429",
      "431",
      "451",
      "500",
      "501",
      "502",
      "503",
      "504",
      "505",
      "506",
      "507",
      "508",
      "510",
      "511",
    ],
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
