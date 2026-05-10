import express from "express";
import {
  addPortfolioItem,
  approveEditor,
  getEditor,
  listEditors,
  uploadProfileMedia,
  upsertMyProfile
} from "../controllers/editorController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { allowRoles, protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", asyncHandler(listEditors));
router.get("/:username", asyncHandler(getEditor));
router.put("/me/profile", protect, allowRoles("editor"), asyncHandler(upsertMyProfile));
router.post(
  "/me/media",
  protect,
  allowRoles("editor"),
  upload.fields([{ name: "profilePicture", maxCount: 1 }, { name: "bannerImage", maxCount: 1 }]),
  asyncHandler(uploadProfileMedia)
);
router.post(
  "/me/portfolio",
  protect,
  allowRoles("editor"),
  upload.fields([{ name: "video", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]),
  asyncHandler(addPortfolioItem)
);
router.patch("/:id/approval", protect, allowRoles("admin"), asyncHandler(approveEditor));

export default router;
