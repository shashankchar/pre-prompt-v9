import express from "express";
import { createReport, getAdminOverview, updateUserStatus } from "../controllers/adminController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { allowRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/reports", asyncHandler(createReport));
router.get("/overview", allowRoles("admin"), asyncHandler(getAdminOverview));
router.patch("/users/:id/status", allowRoles("admin"), asyncHandler(updateUserStatus));

export default router;
