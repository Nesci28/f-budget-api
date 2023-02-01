/* eslint-disable no-use-before-define */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import {
  Project,
  RefreshToken,
  User,
  UserRole,
} from "@yest/yest-stats-api-typescript-fetch";
import * as bcrypt from "bcrypt";
import { connections, Types } from "mongoose";

import { configs } from "../../../constants/configs.constant";
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
    index: true,
    required: true,
  })
  public email: string;

  @Prop({
    type: String,
    required: true,
    set: (x: string) => {
      return bcrypt.hashSync(x, configs.bcryptRound);
    },
    get: MongoUtil.unset,
  })
  public password: string;

  @Prop({
    type: String,
    enum: ["admin", "member"],
    required: true,
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

const schema = SchemaFactory.createForClass(MongoUser);
schema.pre("save", MongoUser.preSave);
schema.pre("insertMany", MongoUser.preInsertMany);

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

export const MongoUserSchema = schema;
