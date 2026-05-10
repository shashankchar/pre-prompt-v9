import EditorProfile from "../models/EditorProfile.js";
import User from "../models/User.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

export async function listEditors(req, res) {
  const { search, category, experienceLevel, language, availability, sort = "featured" } = req.query;
  const query = { approved: true };

  if (search) query.$text = { $search: search };
  if (category) query["portfolio.category"] = category;
  if (experienceLevel) query.experienceLevel = experienceLevel;
  if (language) query.languages = { $in: [language] };
  if (availability) query.availability = availability;

  const sortMap = {
    newest: { createdAt: -1 },
    experience: { experienceLevel: -1 },
    featured: { featured: -1, createdAt: -1 }
  };

  const editors = await EditorProfile.find(query)
    .populate("user", "name avatar status")
    .sort(sortMap[sort] || sortMap.featured);

  res.json({ editors });
}

export async function getEditor(req, res) {
  const editor = await EditorProfile.findOne({ username: req.params.username })
    .populate("user", "name avatar status");
  if (!editor) return res.status(404).json({ message: "Editor not found" });
  res.json({ editor });
}

export async function upsertMyProfile(req, res) {
  const payload = { ...req.body };
  ["editingStyles", "software", "languages"].forEach((key) => {
    if (typeof payload[key] === "string") {
      payload[key] = payload[key].split(",").map((item) => item.trim()).filter(Boolean);
    }
  });

  const profile = await EditorProfile.findOneAndUpdate(
    { user: req.user._id },
    { ...payload, user: req.user._id },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ editor: profile });
}

export async function uploadProfileMedia(req, res) {
  const profile = await EditorProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(404).json({ message: "Create profile first" });

  const updates = {};
  if (req.files?.profilePicture?.[0]) {
    const result = await uploadBuffer(req.files.profilePicture[0], "editbridge/profiles");
    updates.profilePicture = result.secure_url;
  }
  if (req.files?.bannerImage?.[0]) {
    const result = await uploadBuffer(req.files.bannerImage[0], "editbridge/banners");
    updates.bannerImage = result.secure_url;
  }

  Object.assign(profile, updates);
  await profile.save();
  res.json({ editor: profile });
}

export async function addPortfolioItem(req, res) {
  const profile = await EditorProfile.findOne({ user: req.user._id });
  if (!profile) return res.status(404).json({ message: "Create profile first" });

  const item = {
    title: req.body.title,
    category: req.body.category,
    cloudinaryIds: []
  };

  if (req.files?.video?.[0]) {
    const video = await uploadBuffer(req.files.video[0], "editbridge/portfolio");
    item.videoUrl = video.secure_url;
    item.cloudinaryIds.push(video.public_id);
  }
  if (req.files?.thumbnail?.[0]) {
    const thumb = await uploadBuffer(req.files.thumbnail[0], "editbridge/thumbnails");
    item.thumbnailUrl = thumb.secure_url;
    item.cloudinaryIds.push(thumb.public_id);
  }

  profile.portfolio.push(item);
  await profile.save();
  res.status(201).json({ item: profile.portfolio.at(-1) });
}

export async function approveEditor(req, res) {
  const profile = await EditorProfile.findByIdAndUpdate(
    req.params.id,
    { approved: req.body.approved },
    { new: true }
  );
  if (!profile) return res.status(404).json({ message: "Editor profile not found" });

  await User.findByIdAndUpdate(profile.user, { status: req.body.approved ? "active" : "rejected" });
  res.json({ editor: profile });
}
