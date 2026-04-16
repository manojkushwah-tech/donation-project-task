import { z } from "zod";

export const createBookingValidator = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkInDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Check-in date must be a valid ISO date string"),
  checkOutDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Check-out date must be a valid ISO date string"),
  totalGuests: z.number().min(1, "Total guests must be at least 1"),
  totalPrice: z.number().min(0, "Total price must be at least 0"),
  note: z.string().max(500).optional(),
});

export const cancelBookingValidator = z.object({
  reason: z.string().max(500).optional(),
});