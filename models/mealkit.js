import { Schema, Types, model } from "mongoose";

const mealkitSchema = new Schema(
  {
    image: { type: String, required: true },
    tag: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

mealkitSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.mealkitId = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export const MealkitModel = model("Mealkit", mealkitSchema);
