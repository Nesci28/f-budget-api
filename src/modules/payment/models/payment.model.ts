/* eslint-disable no-use-before-define */
import {
  Envelop,
  Payment,
  User,
} from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type PaymentDocument = MongoPayment & Document<MongoPayment>;

@Schema({
  collection: "mongopayment",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoPayment extends MongoBase implements Payment {
  @Prop({
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public userId: string;

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
    type: Types.ObjectId,
    set: MongoUtil.setterObjectId,
    get: MongoUtil.getterObjectId,
    required: true,
    index: true,
  })
  public envelopId: string;

  @Prop({
    type: String,
    required: true,
  })
  public description: string;

  public user?: User;

  public envelop?: Envelop;
}

const schema = SchemaFactory.createForClass(MongoPayment);
schema.pre("save", MongoPayment.preSave);
schema.pre("insertMany", MongoPayment.preInsertMany);

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

export const MongoPaymentSchema = schema;
