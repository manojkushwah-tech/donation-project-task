import { z } from "zod";

const addressSchema = z.object({
  street: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  location: z
    .object({
      lat: z.number().optional(),
      lng: z.number().optional(),
    })
    .optional(),
});

export const createRoomValidator = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(200).trim(),
  description: z.string().max(1000).optional(),
  address: addressSchema.optional(),
  pricePerNight: z.number().min(0, "Price must be a non-negative value"),
  maxGuests: z.number().min(1, "Max guests must be at least 1").optional(),
  amenities: z.array(z.string()).optional(),
  facilities: z.array(z.string()).optional(),
  images: z
    .array(
      z.object({
        url: z.string().url("Image URL must be valid"),
        alt: z.string().max(200).optional(),
      })
    )
    .optional(),
  roomType: z.enum(["SINGLE", "DOUBLE", "DELUXE"]).optional(),
  totalRooms: z.number().min(1, "Total rooms must be at least 1").optional(),
  isActive: z.boolean().optional(),
});

export const updateRoomValidator = createRoomValidator.partial();

export const checkAvailabilityValidator = z.object({
  roomId: z.string().min(1, "Room ID is required"),
  checkInDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Check-in date must be a valid ISO date string"),
  checkOutDate: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Check-out date must be a valid ISO date string"),
});