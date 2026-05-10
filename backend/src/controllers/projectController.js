import EditorProfile from "../models/EditorProfile.js";
import Message from "../models/Message.js";
import Project from "../models/Project.js";
import { uploadBuffer } from "../utils/cloudinaryUpload.js";

export async function createProject(req, res) {
  const editorProfile = await EditorProfile.findById(req.body.editorProfileId);
  if (!editorProfile || !editorProfile.approved) {
    return res.status(404).json({ message: "Approved editor not found" });
  }

  let voiceNoteUrl = "";
  if (req.file) {
    const result = await uploadBuffer(req.file, "editbridge/voice-notes");
    voiceNoteUrl = result.secure_url;
  }

  const referenceLinks = typeof req.body.referenceLinks === "string"
    ? req.body.referenceLinks.split("\n").map((link) => link.trim()).filter(Boolean)
    : [];

  const project = await Project.create({
    title: req.body.title,
    description: req.body.description,
    client: req.user._id,
    editor: editorProfile.user,
    budget: req.body.budget,
    deadline: req.body.deadline,
    referenceLinks,
    voiceNoteUrl
  });

  res.status(201).json({ project });
}

export async function listMyProjects(req, res) {
  const filter = req.user.role === "admin"
    ? {}
    : req.user.role === "editor"
      ? { editor: req.user._id }
      : { client: req.user._id };

  const projects = await Project.find(filter)
    .populate("client", "name avatar")
    .populate("editor", "name avatar")
    .sort({ createdAt: -1 });

  res.json({ projects });
}

export async function getProject(req, res) {
  const project = await Project.findById(req.params.id)
    .populate("client", "name avatar")
    .populate("editor", "name avatar");

  if (!project) return res.status(404).json({ message: "Project not found" });
  const ownsProject = [project.client._id, project.editor._id].some((id) => id.equals(req.user._id));
  if (!ownsProject && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const messages = await Message.find({ project: project._id })
    .populate("sender", "name role avatar")
    .sort({ createdAt: 1 });

  res.json({ project, messages });
}

export async function updateProjectStatus(req, res) {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  const canUpdate = req.user.role === "admin" || project.editor.equals(req.user._id);
  if (!canUpdate) return res.status(403).json({ message: "Only editors or admins can update status" });

  project.status = req.body.status;
  await project.save();
  res.json({ project });
}
