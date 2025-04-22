import { Schema, Types, model } from "mongoose";
import normalize from "normalize-mongoose";

const cartItemSchema = new Schema({
  mealkitID: {
    type: Types.ObjectId,
    ref: "Mealkit",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const cartSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        mealkit: {
          type: Types.ObjectId,
          ref: "Mealkit",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.plugin(normalize);
export const cartModel = model("Cart", cartSchema);
