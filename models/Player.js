import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    moves: {
      type: Number,
      required: true,
    },
    timer: {
      type: Number,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Player", playerSchema);
