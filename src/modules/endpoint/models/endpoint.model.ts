/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, MongoBase } from "@yest/mongoose";
import { Endpoint } from "@yest/yest-stats-api-typescript-fetch";

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
  })
  public path: string;

  @Prop({
    type: Number,
  })
  public errorCount?: number;

  @Prop({
    type: Number,
  })
  public successCount?: number;

  @Prop({
    type: Number,
  })
  public avgRequestPayloadSize?: number;

  @Prop({
    type: Number,
  })
  public avgResponsePayloadSize?: number;

  @Prop({
    type: Number,
  })
  public avgResponseTime?: number;
}

const schema = SchemaFactory.createForClass(MongoEndpoint);
schema.pre("save", MongoEndpoint.preSave);
schema.pre("insertMany", MongoEndpoint.preInsertMany);

export const MongoEndpointSchema = schema;
