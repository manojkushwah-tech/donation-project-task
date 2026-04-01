import { z } from "zod";

// ========================= Create FAQ Validation Schema =========================
const createFAQSchema = z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
});


// ========================= Update FAQ Validation Schema =========================
const updateFAQSchema = z.object({
    question: z.string().min(1, "Question is required").optional(),
    answer: z.string().min(1, "Answer is required").optional(),
    status: z.boolean().optional(),
});

// ========================= Exporting Schemas =========================
export { createFAQSchema, updateFAQSchema };