/* eslint-disable no-use-before-define */
import {
  Envelop,
  Receipt,
  Renew,
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
    index: true,
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
  public incomeMonth?: number;

  @Prop({
    type: Number,
  })
  public incomeTotal?: number;

  @Prop({
    type: Number,
  })
  public outcomeMonth?: number;

  @Prop({
    type: Number,
  })
  public outcomeTotal?: number;

  @Prop({
    type: Number,
  })
  public envelopIncomeMonth?: number;

  @Prop({
    type: Number,
  })
  public envelopIncomeTotal?: number;

  @Prop({
    type: Number,
  })
  public envelopOutcomeMonth?: number;

  @Prop({
    type: Number,
  })
  public envelopOutcomeTotal?: number;

  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
  })
  public renewId?: string;

  public user?: User;

  public envelop?: Envelop;

  public renew?: Renew;
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

schema.virtual("renew", {
  ref: () => {
    const model = getRefModel(connections, "MongoRenew");
    return model;
  },
  localField: "renewId",
  foreignField: "id",
  autopopulate: false,
  justOne: true,

  get: MongoUtil.getterUnsetPopulate,
});

export const MongoReceiptSchema = schema;
