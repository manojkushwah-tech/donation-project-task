import { z } from "zod";

// ========================= Create Committee Validation Schema =========================
const createCommitteeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    designation: z.string().optional(),
});


// ========================= Update Committee Validation Schema =========================
const updateCommitteeSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    designation: z.string().optional(),
    status: z.boolean().optional(),
});

// ========================= Exporting Schemas =========================
export { createCommitteeSchema, updateCommitteeSchema };