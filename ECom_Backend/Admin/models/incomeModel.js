import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ECommerce-Data",
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    default: "income",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ECom Income", incomeSchema);
