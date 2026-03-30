import {
  createEventService,
  getAllEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} from "../services/event.service.js";
import {
  errorResponse,
  successResponse,
} from "../helper/response.helper.js";
import {
  eventMessages,
  httpStatus,
  roles,
} from "../helper/constants.js";

// ========================= Create Event =========================
export const createEvent = async (req, res) => {
  try {

    const data = req.validatedData;
    await createEventService(data, req.file);
    return successResponse(
      res,
      null,
      eventMessages.CREATED,
      httpStatus.CREATED
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || eventMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get All Events =========================
export const getAllEvents = async (req, res) => {
  try {
    const isAdmin = req.user?.role === roles.ADMIN;
    // fetch all events for admin, and only active events for regular users
    const condition = isAdmin ? {} : { status: true };

    // Implement logic to fetch all events
    const events = await getAllEventsService(condition);
    return successResponse(
      res,
      eventMessages.FETCHED_ALL,
      events,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || eventMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get Event By ID =========================
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to fetch event by ID
    const event = await getEventByIdService(id);
    return successResponse(
      res,
      eventMessages.FETCHED,
      event,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || eventMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Update Event =========================
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.validatedData;
    // Implement logic to update event by ID with new data and file

    const updatedEvent = await updateEventService(id, data, req.file);


    return successResponse(
      res,
      eventMessages.UPDATED,
      updatedEvent,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || eventMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Delete Event =========================
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to delete event by ID    
      await deleteEventService(id);    
    return successResponse(
      res,
      eventMessages.DELETED,
      {}, // Replace with actual data
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || eventMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

