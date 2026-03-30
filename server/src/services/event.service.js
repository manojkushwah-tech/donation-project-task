import { Event } from "../models/index.js";
import { uploadImage, deleteImage } from "./imageKit.services.js";
import ApiError from "../utils/ApiError.js";
import {
  eventMessages,
  httpStatus,
  image
} from "../helper/constants.js";

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

export const getAllEventsService = async (condition = {}) => {
  try {
    const events = await Event.find(condition).sort({ createdAt: -1 });
    return events;
  } catch (error) {
    throw new ApiError(
      eventMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getEventByIdService = async (id) => {
  try {
    const event = await Event.findById(id);
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

export const updateEventService = async (id, data, file) => {
  try {
    const event = await Event.findById(id);
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
          await deleteImage(event.image.fileId);
        }
      }
      catch (error) {
        throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
      }
    }

    event.title = data.title || event.title;
    event.content = data.content || event.content;
    event.description = data.description || event.description;
    event.image = imageData;
    const updatedEvent = await event.save();
    return updatedEvent;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      eventMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteEventService = async (id) => {
  try {
    const event = await Event.findById(id);
    if (!event) {
      throw new ApiError(eventMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    // ================= Delete Image =================
    if (event.image?.fileId) {
      await deleteImage(event.image.fileId);
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

