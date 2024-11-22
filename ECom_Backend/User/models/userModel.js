import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mob: {
      type: Number,
    },

    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      required: true,
    },
    address: [
      {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        postalCode: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("ECommerce-Data", userSchema);
