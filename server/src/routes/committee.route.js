import {
    createCommittee,
    getAllCommittees,
    getCommitteeById,
    updateCommittee,
    deleteCommittee
} from "../controllers/committee.controller.js";
import express from "express";
const router = express.Router();
import { validate } from "../middlewares/zod.validate.middleware.js";
import { createCommitteeSchema, updateCommitteeSchema } from "../validator/committee.validator.js";
import { upload } from "../middlewares/upload.middleware.js";
import { verifyAdmin } from "../middlewares/token.verify.middleware.js";

// ============================== Admin Routes ==============================
router.get("/admin", verifyAdmin, getAllCommittees);
router.get("/admin/:id", verifyAdmin, getCommitteeById);
router.post("/admin", verifyAdmin, upload.single("image"), validate(createCommitteeSchema), createCommittee);
router.put("/admin/:id", verifyAdmin, upload.single("image"), validate(updateCommitteeSchema), updateCommittee);
router.delete("/admin/:id", verifyAdmin, deleteCommittee);

// ============================== User Routes ==============================
// router.get("/", getAllCommittees);
// router.get("/:id", getCommitteeById);

export default router;