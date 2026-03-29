import { Event } from "../models/index.js";
import logger from "../config/logger.config.js";
import { uploadImage, deleteImage } from "./imageKit.services.js";
import ApiError from "../utils/ApiError.js";
import {
  occasionMessages,
  httpStatus,
  image
} from "../helper/constants.js";

export const createEventService = async (data, file) => {
  const { title, content, description } = data;

  let imageData = null;

  // Upload image
  if (file) {
    try {
      console.log("Uploading image...", file);
      imageData = await uploadImage(file, "events");
      cinsole.log("Image uploaded successfully:", imageData);
    } catch (error) {

      logger.error(`Image upload failed: ${error.message}`);
      throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
    }
  }

  try {
    const newEvent = new Event({
      title,
      content,
      description,
      image: imageData,
    });

    const savedEvent = await newEvent.save();
    return savedEvent;

  } catch (error) {
    logger.error(`Event creation failed: ${error.message}`);
    // rollback uploaded image
    if (imageData?.fileId) {
      await deleteImage(imageData.fileId);
    }

    throw new ApiError(
      occasionMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};