import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createPrompt, listPrompts } from "../controllers/promptController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", asyncHandler(listPrompts));
router.post("/", protect, asyncHandler(createPrompt));

export default router;
