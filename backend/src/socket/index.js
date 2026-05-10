import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { moderateText } from "../utils/moderation.js";

export function configureSocket(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user || user.status === "banned") return next(new Error("Unauthorized"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("project:join", async (projectId) => {
      const project = await Project.findById(projectId);
      if (!project) return;

      const allowed = socket.user.role === "admin"
        || project.client.equals(socket.user._id)
        || project.editor.equals(socket.user._id);
      if (allowed) socket.join(String(project._id));
    });

    socket.on("message:send", async ({ projectId, text }) => {
      const project = await Project.findById(projectId);
      if (!project) return;

      const allowed = socket.user.role === "admin"
        || project.client.equals(socket.user._id)
        || project.editor.equals(socket.user._id);
      if (!allowed) return;

      const moderation = moderateText(text);
      const message = await Message.create({
        project: project._id,
        sender: socket.user._id,
        text,
        ...moderation
      });
      const populated = await message.populate("sender", "name role avatar");
      io.to(String(project._id)).emit("message:new", populated);
    });
  });
}
