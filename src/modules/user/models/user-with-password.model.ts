/* eslint-disable no-use-before-define */
import { RefreshToken, User } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, MongoBase } from "@yest/mongoose";

import { MongoRefreshTokenSchema } from "./refresh-token.model";

export type UserWithPasswordDocument = MongoUserWithPassword &
  Document<MongoUserWithPassword>;

@Schema({
  collection: "mongouser",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoUserWithPassword extends MongoBase implements User {
  @Prop({
    type: String,
    index: true,
    required: true,
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

const schema = SchemaFactory.createForClass(MongoUserWithPassword);
schema.pre("save", MongoUserWithPassword.preSave);
schema.pre("insertMany", MongoUserWithPassword.preInsertMany);

export const MongoUserWithPasswordSchema = schema;
