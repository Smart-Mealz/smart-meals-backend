import mongoose from "mongoose";
import { Schema, Types, model } from "mongoose";
import normalize from "normalize-mongoose";

const mealkitSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
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
mealkitSchema.plugin(normalize);
export const MealkitModel = model("Mealkit", mealkitSchema);
