import { z } from "zod";

const createEventSchema = z.object({
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    description: z.string().optional(),
});

export { createEventSchema };