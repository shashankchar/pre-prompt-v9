import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: String,
    category: { type: String, enum: ["gaming", "reels", "podcasts", "anime", "cinematic", "ads"] },
    videoUrl: String,
    thumbnailUrl: String,
    cloudinaryIds: [String]
  },
  { timestamps: true }
);

const editorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    bio: String,
    profilePicture: String,
    bannerImage: String,
    editingStyles: [String],
    software: [String],
    languages: [String],
    experienceLevel: { type: String, enum: ["beginner", "intermediate", "expert"], default: "intermediate" },
    turnaroundTime: String,
    pricingRange: String,
    availability: { type: String, enum: ["available", "busy", "offline"], default: "available" },
    socialLinksPrivate: {
      instagram: String,
      discord: String,
      telegram: String,
      website: String
    },
    approved: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    portfolio: [portfolioSchema]
  },
  { timestamps: true }
);

editorProfileSchema.index({ username: "text", bio: "text", editingStyles: "text" });

export default mongoose.model("EditorProfile", editorProfileSchema);
