import { z } from "zod";

// ========================= Create Event Validation Schema =========================
const createEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    description: z.string().optional(),
});


// ========================= Update Event Validation Schema =========================
const updateEventSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    content: z.string().optional(),
    description: z.string().optional(),
});

export { createEventSchema, updateEventSchema };