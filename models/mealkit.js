import { Schema, Types, model } from "mongoose";

const mealkitSchema = new Schema(
  {
    image: { type: String, required: true },
    tag: {
      type: String,
      enum: ["Spicy", "Sweet", "Vintage", "Savory", "Fresh", "Fruity"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, enum: ["Continental", "Local"] },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    recipeSteps: { type: String, required: true },
    servings: { type: Number, required: true },
    userId: { type: Types.ObjectId, required: true, ref: "User" },
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
