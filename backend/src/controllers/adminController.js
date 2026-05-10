import EditorProfile from "../models/EditorProfile.js";
import Message from "../models/Message.js";
import Project from "../models/Project.js";
import Report from "../models/Report.js";
import User from "../models/User.js";

export async function getAdminOverview(req, res) {
  const [users, pendingEditors, projects, flaggedMessages, reports] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).limit(100),
    EditorProfile.find({ approved: false }).populate("user", "name email status"),
    Project.find().populate("client editor", "name email role").sort({ createdAt: -1 }).limit(100),
    Message.find({ flagged: true }).populate("sender", "name role").sort({ createdAt: -1 }).limit(100),
    Report.find().populate("reporter user message").sort({ createdAt: -1 }).limit(100)
  ]);

  res.json({ users, pendingEditors, projects, flaggedMessages, reports });
}

export async function updateUserStatus(req, res) {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  ).select("-password");

  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
}

export async function createReport(req, res) {
  const report = await Report.create({
    reporter: req.user._id,
    user: req.body.user,
    message: req.body.message,
    reason: req.body.reason
  });
  res.status(201).json({ report });
}
