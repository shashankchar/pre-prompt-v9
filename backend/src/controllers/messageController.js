import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { moderateText } from "../utils/moderation.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

async function assertProjectAccess(projectId, user) {
  const project = await Project.findById(projectId);
  if (!project) return null;
  const allowed = user.role === "admin" || project.client.equals(user._id) || project.editor.equals(user._id);
  return allowed ? project : false;
}

export async function createMessage(req, res) {
  const project = await assertProjectAccess(req.params.projectId, req.user);
  if (!project) return res.status(project === null ? 404 : 403).json({ message: "Project unavailable" });

  let fileUrl = "";
  if (req.file) {
    const result = await uploadBuffer(req.file, "editbridge/chat");
    fileUrl = result.secure_url;
  }

  const moderation = moderateText(req.body.text);
  const message = await Message.create({
    project: project._id,
    sender: req.user._id,
    text: req.body.text,
    fileUrl,
    fileType: req.body.fileType || "file",
    ...moderation
  });

  const populated = await message.populate("sender", "name role avatar");
  req.app.get("io")?.to(String(project._id)).emit("message:new", populated);
  res.status(201).json({ message: populated });
}
