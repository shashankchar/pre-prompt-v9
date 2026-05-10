import express from "express";
import { createMessage } from "../controllers/messageController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/:projectId", protect, upload.single("file"), asyncHandler(createMessage));

export default router;
