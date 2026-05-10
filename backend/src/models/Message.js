import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: String,
    fileUrl: String,
    fileType: { type: String, enum: ["file", "audio", "video", "image"], default: "file" },
    flagged: { type: Boolean, default: false },
    warning: String
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
