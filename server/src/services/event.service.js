import { Event } from "../models/index.js";
import { uploadImage, deleteImage } from "./imageKit.services.js";
import ApiError from "../utils/ApiError.js";
import {
  eventMessages,
  httpStatus,
  image
} from "../helper/constants.js";

// ================= Create New Event =================
export const createEventService = async (data, file) => {
  const { title, content, description } = data;

  let imageData = null;

  // ================= Upload Image =================
  if (file) {
    try {
      imageData = await uploadImage(file, "events");
    } catch (error) {
      throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
    }
  }

  try {
    // ================= Check Duplicate =================
    const existingEvent = await Event.findOne({
      title: { $regex: `^${title}$`, $options: "i" } // ✅ case-insensitive
    });

    if (existingEvent) {
      throw new ApiError(eventMessages.ALREADY_EXISTS, httpStatus.CONFLICT);
    }

    // ================= Create Event =================
    const newEvent = new Event({
      title,
      content,
      description,
      image: imageData,
    });

    const savedEvent = await newEvent.save();
    return savedEvent;

  } catch (error) {
    // ================= Rollback Image =================
    if (imageData?.fileId) {
      await deleteImage(imageData.fileId);
    }

    // ✅ Preserve original error
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      eventMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get All Events with Optional Filtering =================
export const getAllEventsService = async ({
  condition = {},
  skip = 0,
  limit = 10,
  sort = { createdAt: -1 },
}) => {
  try {
    const [events, total] = await Promise.all([
      Event.find(condition)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(), // ✅ performance boost

      Event.countDocuments(condition),
    ]);

    // ✅ Transform image field (clean approach)
    const transformedEvents = events.map((event) => ({
      ...event,
      image: event.image?.url || null,
    }));

    return {
      events: transformedEvents,
      total,
    };
  } catch (error) {
    throw new ApiError(
      eventMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get Single Event by ID =================
export const getEventByIdService = async (id, isAdmin ) => {
  try {
    const event = await Event.findOne({ _id: id, ...(isAdmin ? {} : { status: true }) });
    if (!event) {
      throw new ApiError(eventMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return event;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      eventMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Update Event by ID =================
export const updateEventService = async (id, data, file) => {
  try {
    console.log("Updating event with ID:", id);
    const event = await Event.findById(id);
    console.log("Event found:", event);
    if
      (!event) {
      throw new ApiError(eventMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    let imageData = event.image;
    // ================= Upload New Image =================
    if (file) {
      try {
        imageData = await uploadImage(file, "events");
        // ================= Delete Old Image =================
        if (event.image?.fileId) {
          const result = await deleteImage(event.image.fileId);
          console.log("Image deleted",(result? "successfully" : "failed"));
        }
      }
      catch (error) {
        console.error("Image upload failed:", error);
        throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
      }
    }

    event.title = data.title || event.title;
    event.content = data.content || event.content;
    event.description = data.description || event.description;
    event.image = imageData;
    if (data.status !== undefined && typeof data.status === "boolean") {
      event.status = data.status;
    }
    const updatedEvent = await event.save();
    return updatedEvent;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error in updateEventService:", error);
      throw error;
    }
    console.error("Unexpected error in updateEventService:", error);
    throw new ApiError(
      eventMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Delete Event by ID =================
export const deleteEventService = async (id) => {
  try {
    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(eventMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    // ================= Delete Image =================
    if (event.image?.fileId) {
      const result = await deleteImage(event.image.fileId);
      console.log("Image deleted",(result? "successfully" : "failed"));
    }

    await Event.findByIdAndDelete(id);
    return;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      eventMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

