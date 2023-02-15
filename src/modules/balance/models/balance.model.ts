/* eslint-disable no-use-before-define */
import { Balance, User } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type BalanceDocument = MongoBalance & Document<MongoBalance>;

@Schema({
  collection: "mongobalance",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoBalance extends MongoBase implements Balance {
  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public userId: string;

  @Prop({
    type: Number,
    default: 0,
  })
  public incomeMonth?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public incomeTotal?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public outcomeMonth?: number;

  @Prop({
    type: Number,
    default: 0,
  })
  public outcomeTotal?: number;

  public user?: User;
}

const schema = SchemaFactory.createForClass(MongoBalance);
schema.pre("save", MongoBalance.preSave);
schema.pre("insertMany", MongoBalance.preInsertMany);

schema.virtual("user", {
  ref: () => {
    const model = getRefModel(connections, "MongoUser");
    return model;
  },
  localField: "userId",
  foreignField: "id",
  autopopulate: false,
  justOne: true,

  get: MongoUtil.getterUnsetPopulate,
});

export const MongoBalanceSchema = schema;
