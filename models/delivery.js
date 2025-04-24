import { Schema, model, Types } from "mongoose";
import normalize from "normalize-mongoose";

const orderSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    default: "Ghana",
  },
  streetAddress: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    enum: [
      "Greater Accra",
      "Volta",
      "Oti",
      "Northern",
      "North East",
      "Savannah",
      "Upper West",
      "Upper East",
      "Brong Ahafo",
      "Bono East",
      "Ahafo",
      "Central",
      "Eastern",
      "Western",
      "Western North",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "cancelled"],
    default: "pending",
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  cartSubtotal: {
    type: Number,
    required: true,
  },
  finalTotal: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.plugin(normalize);
export const DeliveryModel = model("Delivery", orderSchema);
