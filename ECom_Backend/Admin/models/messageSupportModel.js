import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  user: {
   type:String,
    
  },
  // product: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product",
  //   required: true,
  // },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "Closed"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MessageSupport = mongoose.model("MessageSupport", messageSchema);
