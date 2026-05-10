import express from "express";
import { createProject, getProject, listMyProjects, updateProjectStatus } from "../controllers/projectController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);
router.get("/", asyncHandler(listMyProjects));
router.post("/", allowRoles("client", "admin"), upload.single("voiceNote"), asyncHandler(createProject));
router.get("/:id", asyncHandler(getProject));
router.patch("/:id/status", allowRoles("editor", "admin"), asyncHandler(updateProjectStatus));

export default router;
