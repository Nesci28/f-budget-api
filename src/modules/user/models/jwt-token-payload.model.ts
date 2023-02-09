/* eslint-disable no-use-before-define */
import { JwtTokenPayload } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, MongoBase } from "@yest/mongoose";

export type JwtTokenPayloadDocument = MongoJwtTokenPayload &
  Document<MongoJwtTokenPayload>;

@Schema({
  collection: "mongojwttokenpayload",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoJwtTokenPayload extends MongoBase implements JwtTokenPayload {
  @Prop({
    type: String,
    required: true,
  })
  public userId: string;
}

const schema = SchemaFactory.createForClass(MongoJwtTokenPayload);
schema.pre("save", MongoJwtTokenPayload.preSave);
schema.pre("insertMany", MongoJwtTokenPayload.preInsertMany);

export const MongoJwtTokenPayloadSchema = schema;
