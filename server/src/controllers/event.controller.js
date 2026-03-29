import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { createEventService } from "../services/event.service.js";
import { successResponse } from "../helper/response.helper.js";
import { isServiceAvailable } from "../helper/service.helper.js";
import {
  occasionMessages,
  httpStatus,
  serviceMessages,
  serviceNames
} from "../helper/constants.js";

// ========================= Create Event =========================
export const createEvent = asyncHandler(async (req, res) => {

  // Check service availability
  if (!isServiceAvailable(serviceNames.EVENT)) {
    throw new ApiError(
      serviceMessages.UNAVAILABLE,
      httpStatus.SERVICE_UNAVAILABLE
    );
  }
  console.log("Received request to create event with data:", req.body, "and file:", req.file);
  const data = req.validatedData;
  console.log("Validated data:", data);
  // Call service
  const event = await createEventService(data, req.file);

  // Send response
  return successResponse(
    res,
    httpStatus.CREATED,
    occasionMessages.CREATED,
    event
  );
});