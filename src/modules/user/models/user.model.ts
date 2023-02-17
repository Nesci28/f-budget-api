/* eslint-disable no-use-before-define */
import { RefreshToken, User } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, MongoBase } from "@yest/mongoose";

import { MongoRefreshTokenSchema } from "./refresh-token.model";

export type UserDocument = MongoUser & Document<MongoUser>;

@Schema({
  collection: "mongouser",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoUser extends MongoBase implements User {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public email: string;

  @Prop({
    type: String,
    required: true,
  })
  public password: string;

  @Prop({
    type: [MongoRefreshTokenSchema],
  })
  public refreshTokens?: RefreshToken[];

  @Prop({
    type: String,
  })
  public uuid?: string;
}

const schema = SchemaFactory.createForClass(MongoUser);
schema.pre("save", MongoUser.preSave);
schema.pre("insertMany", MongoUser.preInsertMany);

export const MongoUserSchema = schema;
