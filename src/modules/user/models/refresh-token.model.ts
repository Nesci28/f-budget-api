/* eslint-disable no-use-before-define */
import { RefreshToken } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { MongoBaseChild, MongoUtil } from "@yest/mongoose";
import { Types } from "mongoose";

@Schema({
  _id: false,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
class MongoRefreshToken extends MongoBaseChild implements RefreshToken {
  @Prop({
    type: String,
    required: true,
    index: true,
  })
  public token: string;

  @Prop({
    type: String,
    required: true,
  })
  public deviceUUID: string;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
  })
  public dealerUserId?: string;

  @Prop({
    type: String,
    required: true,
  })
  public userAgent: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  public rememberMe: boolean;

  @Prop({
    type: Number,
    required: true,
  })
  public iat: number;

  @Prop({
    type: Number,
    required: true,
  })
  public exp: number;
}

const schema = SchemaFactory.createForClass(MongoRefreshToken);

export const MongoRefreshTokenSchema = schema;
