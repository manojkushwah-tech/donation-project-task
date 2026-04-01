import {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ

} from "../controllers/faq.controller.js";
import express from "express";
const router = express.Router();
import { validate } from "../middlewares/zod.validate.middleware.js";
import { createFAQSchema, updateFAQSchema } from "../validator/faq.validator.js";
import { verifyAdmin } from "../middlewares/token.verify.middleware.js";


// ============================== Admin Routes ==============================
router.get("/admin", verifyAdmin, getAllFAQs);
router.get("/admin/:id", verifyAdmin, getFAQById);
router.post("/", verifyAdmin, validate(createFAQSchema), createFAQ);
router.put("/admin/:id", verifyAdmin, validate(updateFAQSchema), updateFAQ);
router.delete("/admin/:id", verifyAdmin, deleteFAQ);

// ============================== User Routes ==============================
router.get("/", getAllFAQs);
router.get("/:id", getFAQById);


export default router;