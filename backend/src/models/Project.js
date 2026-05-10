import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    budget: Number,
    deadline: Date,
    referenceLinks: [String],
    voiceNoteUrl: String,
    attachments: [String],
    status: {
      type: String,
      enum: ["Pending", "Accepted", "In Progress", "Revision", "Completed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
