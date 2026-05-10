import User from "../models/User.js";
import { signToken } from "../utils/token.js";

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar
  };
}

export async function register(req, res) {
  const { name, email, password, role = "client" } = req.body;
  if (!["client", "editor"].includes(role)) {
    return res.status(400).json({ message: "Invalid public role" });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name,
    email,
    password,
    role,
    status: role === "editor" ? "pending" : "active"
  });

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ user: publicUser(user), token: signToken(user) });
}

export async function me(req, res) {
  res.json({ user: publicUser(req.user) });
}
