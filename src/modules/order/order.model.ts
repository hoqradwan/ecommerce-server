import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
