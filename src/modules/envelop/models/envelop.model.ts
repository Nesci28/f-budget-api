/* eslint-disable no-use-before-define */
import {
  Envelop,
  EnvelopType,
  User,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type EnvelopDocument = MongoEnvelop & Document<MongoEnvelop>;

@Schema({
  collection: "mongoenvelop",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoEnvelop extends MongoBase implements Envelop {
  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public userId: string;

  @Prop({
    type: String,
    required: true,
  })
  public name: string;

  @Prop({
    type: String,
    required: true,
    enum: ["Income", "Outcome"],
  })
  public type: EnvelopType;

  @Prop({
    type: Number,
    required: true,
  })
  public budget: number;

  @Prop({
    type: Number,
  })
  public balanceMonth?: number;

  @Prop({
    type: Number,
  })
  public balanceTotal?: number;

  public user?: User;
}

const schema = SchemaFactory.createForClass(MongoEnvelop);
schema.pre("save", MongoEnvelop.preSave);
schema.pre("insertMany", MongoEnvelop.preInsertMany);

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

export const MongoEnvelopSchema = schema;
