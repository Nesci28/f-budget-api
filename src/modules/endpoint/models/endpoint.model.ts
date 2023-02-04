/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Endpoint,
  HttpMethod,
  Project,
} from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

export type EndpointDocument = MongoEndpoint & Document<MongoEndpoint>;

@Schema({
  collection: "mongoendpoint",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoEndpoint extends MongoBase implements Endpoint {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public path: string;

  @Prop({
    type: String,
    required: true,
    index: true,
    enum: ["Get", "Post", "Put", "Patch", "Delete"],
  })
  public httpMethod: HttpMethod;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public projectId: string;

  @Prop({
    type: Number,
    default: 0,
  })
  public errorCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public successCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public avgRequestPayloadSize: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public avgResponsePayloadSize: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public avgResponseTime: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public requestCount: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public responseCount: number;

  public project?: Project;
}

const schema = SchemaFactory.createForClass(MongoEndpoint);
schema.pre("save", MongoEndpoint.preSave);
schema.pre("insertMany", MongoEndpoint.preInsertMany);

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

export const MongoEndpointSchema = schema;
