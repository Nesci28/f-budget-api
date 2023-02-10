/* eslint-disable no-use-before-define */
import { Envelop, Renew, User } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type RenewDocument = MongoRenew & Document<MongoRenew>;

@Schema({
  collection: "mongorenew",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoRenew extends MongoBase implements Renew {
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
    type: Number,
    required: true,
  })
  public amount: number;

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
    type: Boolean,
    required: true,
  })
  public isBusinessDay: boolean;

  public user?: User;

  public envelop?: Envelop;
}

const schema = SchemaFactory.createForClass(MongoRenew);
schema.pre("save", MongoRenew.preSave);
schema.pre("insertMany", MongoRenew.preInsertMany);

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

export const MongoRenewSchema = schema;
