import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reason: String,
    status: { type: String, enum: ["open", "reviewed"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
