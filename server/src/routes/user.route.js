const router = express.Router();
import express from "express";
import { verifyUser, verifyAdmin } from "../middlewares/token.verify.middleware.js";
import { getUserDetails, getAllUsers } from "../controllers/user.controller.js";

router.get("/details", verifyUser, getUserDetails);
router.get("/:userId/details", verifyAdmin, getUserDetails);
router.get("/admin/users", verifyAdmin, getAllUsers);
export default router;