import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    country: { type: String, trim: true },
    pincode: { type: String, trim: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Room title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    address: addressSchema,
    pricePerNight: {
      type: Number,
      required: [true, "Price per night is required"],
      min: [0, "Price must be a non-negative value"],
    },
    maxGuests: {
      type: Number,
      default: 1,
      min: [1, "Max guests must be at least 1"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    facilities: {
      type: [String],
      default: [],
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    roomType: {
      type: String,
      enum: ["SINGLE", "DOUBLE", "DELUXE"],
      default: "SINGLE",
    },
    totalRooms: {
      type: Number,
      default: 1,
      min: [1, "Total rooms must be at least 1"],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

roomSchema.index({ title: "text", description: "text", "address.city": "text", "address.state": "text" });
roomSchema.index({ pricePerNight: 1, roomType: 1, isActive: 1 });

const Room = mongoose.model("Room", roomSchema);
export default Room;