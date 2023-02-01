/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, MongoBase } from "@yest/mongoose";
import {
  JwtTokenPayload,
  UserRole,
} from "@yest/yest-stats-api-typescript-fetch";

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

  @Prop({
    type: String,
    required: true,
    enum: ["admin", "member"],
  })
  public role: UserRole;
}

const schema = SchemaFactory.createForClass(MongoJwtTokenPayload);
schema.pre("save", MongoJwtTokenPayload.preSave);
schema.pre("insertMany", MongoJwtTokenPayload.preInsertMany);

export const MongoJwtTokenPayloadSchema = schema;
