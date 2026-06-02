import Prompt from "../models/Prompt.js";

export async function listPrompts(req, res) {
  const prompts = await Prompt.find({ public: true })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({ prompts });
}

export async function createPrompt(req, res) {
  const { title, text, tags } = req.body;
  if (!title?.trim() || !text?.trim()) {
    return res.status(400).json({ message: "Title and prompt text are required." });
  }

  const prompt = await Prompt.create({
    title: title.trim(),
    text: text.trim(),
    tags: typeof tags === "string"
      ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : Array.isArray(tags)
        ? tags.map((tag) => tag.trim()).filter(Boolean)
        : [],
    author: req.user._id,
    authorName: req.user.name || req.user.email,
    public: true
  });

  res.status(201).json({ prompt });
}
