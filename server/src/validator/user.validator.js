import { z } from "zod";

export const updateUserStatusValidator = z.object({
  status: z.boolean(),
});
