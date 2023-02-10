/* eslint-disable no-use-before-define */
import {
  Envelop,
  Receipt,
  User,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type ReceiptDocument = MongoReceipt & Document<MongoReceipt>;

@Schema({
  collection: "mongoreceipt",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoReceipt extends MongoBase implements Receipt {
  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public userId: string;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public envelopId: string;

  @Prop({
    type: Date,
    default: () => {
      return new Date().toISOString();
    },
    required: true,
  })
  public date: Date;

  @Prop({
    type: Number,
    required: true,
  })
  public amount: number;

  @Prop({
    type: String,
  })
  public description?: string;

  @Prop({
    type: String,
  })
  public scan?: string;

  @Prop({
    type: Number,
  })
  public balanceMonth?: number;

  @Prop({
    type: Number,
  })
  public balanceTotal?: number;

  @Prop({
    type: Number,
  })
  public envelopBalanceMonth?: number;

  @Prop({
    type: Number,
  })
  public envelopBalanceTotal?: number;

  @Prop({
    type: Boolean,
    required: true,
  })
  public isFromRenew: boolean;

  public user?: User;

  public envelop?: Envelop;
}

const schema = SchemaFactory.createForClass(MongoReceipt);
schema.pre("save", MongoReceipt.preSave);
schema.pre("insertMany", MongoReceipt.preInsertMany);

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

schema.virtual("envelop", {
  ref: () => {
    const model = getRefModel(connections, "MongoEnvelop");
    return model;
  },
  localField: "envelopId",
  foreignField: "id",
  autopopulate: false,
  justOne: true,

  get: MongoUtil.getterUnsetPopulate,
});

export const MongoReceiptSchema = schema;
