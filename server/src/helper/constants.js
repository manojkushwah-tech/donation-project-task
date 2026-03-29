import e from "express";

export const serverErrorMessage = "Internal Server Error";
export const envTypes = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export const httpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const serviceNames = {
  EVENT: "Event Service",
  DONATION: "Donation Service",
}

export const serviceMessages = {
  UNAVAILABLE: "Service is currently unavailable. Please try again later.",
};

export const occasionMessages = {
  CREATED: "Event created successfully",
  CREATE_FAILED: "Failed to create event",
};

export const image = {
  allowedMime: {
    JPEG: "image/jpeg",
    JPG: "image/jpg", 
    PNG: "image/png",
    GIF: "image/gif",
    WEBP: "image/webp",
  },
  messages: {
    UPLOAD_FAILED: "Image upload failed",
    NO_FILE_PROVIDED: "No file provided",
    INVALID_TYPE: "Invalid file type",
    FILE_ID_REQUIRED: "File ID is required",
    DELETE_FAILED: "Failed to delete image",
  },
};

export const validationMessages = {
  invalidData: "Invalid data provided",
};