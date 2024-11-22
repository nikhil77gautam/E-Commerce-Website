import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
  },
  categoryCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("ECom Category", categorySchema);
