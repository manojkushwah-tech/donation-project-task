import express from "express";
import { verifyUser, verifyAdmin } from "../middlewares/token.verify.middleware.js";
import { validate } from "../middlewares/zod.validate.middleware.js";
import { getUserDetails, getAllUsers, updateUserStatus } from "../controllers/user.controller.js";
import { updateUserStatusValidator } from "../validator/user.validator.js";

const router = express.Router();

router.get("/details", verifyUser, getUserDetails);
router.get("/:userId/details", verifyAdmin, getUserDetails);
router.get("/admin/users", verifyAdmin, getAllUsers);
router.patch(
  "/admin/:userId/status",
  verifyAdmin,
  validate(updateUserStatusValidator),
  updateUserStatus
);
export default router;