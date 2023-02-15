/* eslint-disable no-use-before-define */
import { Picture, User } from "@f-budget/f-budget-api-typescript-fetch";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, getRefModel, MongoBase, MongoUtil } from "@yest/mongoose";
import { connections, Types } from "mongoose";

export type PictureDocument = MongoPicture & Document<MongoPicture>;

@Schema({
  collection: "mongopicture",
  timestamps: true,
  toObject: {
    virtuals: true,
    getters: true,
  },
})
export class MongoPicture extends MongoBase implements Picture {
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
  public filename: string;

  public user?: User;
}

const schema = SchemaFactory.createForClass(MongoPicture);
schema.pre("save", MongoPicture.preSave);
schema.pre("insertMany", MongoPicture.preInsertMany);

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

export const MongoPictureSchema = schema;
