/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Project,
  RefreshToken,
  User,
  UserRole,
} from "@yest/yest-stats-api-typescript-fetch";
import { connections, Types } from "mongoose";

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
    type: String,
    enum: ["admin", "member"],
  })
  public role: UserRole;

  @Prop({
    type: [Types.ObjectId],
    set: MongoUtil.setterObjectIds,
    get: MongoUtil.getterObjectIds,
  })
  public projectIds?: string[];

  @Prop({
    type: [MongoRefreshTokenSchema],
  })
  public refreshTokens?: RefreshToken[];

  public projects?: Project[];
}

const schema = SchemaFactory.createForClass(MongoUserWithPassword);
schema.pre("save", MongoUserWithPassword.preSave);
schema.pre("insertMany", MongoUserWithPassword.preInsertMany);

schema.virtual("projects", {
  ref: () => {
    const model = getRefModel(connections, "MongoProject");
    return model;
  },
  localField: "projectIds",
  foreignField: "id",
  autopopulate: false,
  justOne: false,

  get: MongoUtil.getterUnsetPopulates,
});

export const MongoUserWithPasswordSchema = schema;
