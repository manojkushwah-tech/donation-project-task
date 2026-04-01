
export const serverErrorMessage = "Internal Server Error";

export const envTypes = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
};

export const roles = {
  ADMIN: "admin",
  USER: "user",
}

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

export const eventMessages = {
  CREATED: "Event created successfully",
  CREATE_FAILED: "Failed to create event",
  ALREADY_EXISTS: "An event with the same title already exists",
  FETCHED_ALL: "Events fetched successfully",
  FETCHED: "Event fetched successfully",
  FETCH_FAILED: "Failed to fetch event",
  UPDATED: "Event updated successfully",
  UPDATE_FAILED: "Failed to update event",
  DELETED: "Event deleted successfully",
  DELETE_FAILED: "Failed to delete event",
  NOT_FOUND: "Event not found",
};

export const committeeMessages = {
  CREATED: "Committee member created successfully",
  CREATE_FAILED: "Failed to create committee member",
  ALREADY_EXISTS: "A committee member with the same name already exists",
  FETCHED_ALL: "Committee members fetched successfully",
  FETCHED: "Committee member fetched successfully",
  FETCH_FAILED: "Failed to fetch committee member",
  UPDATED: "Committee member updated successfully",
  UPDATE_FAILED: "Failed to update committee member",
  DELETED: "Committee member deleted successfully",
  DELETE_FAILED: "Failed to delete committee member",
  NOT_FOUND: "Committee member not found",
};

export const faqMessages = {
  CREATED: "FAQ created successfully",
  CREATE_FAILED: "Failed to create FAQ",
  ALREADY_EXISTS: "An FAQ with the same question already exists",
  FETCHED_ALL: "FAQs fetched successfully",
  FETCHED: "FAQ fetched successfully",
  FETCH_FAILED: "Failed to fetch FAQ",
  UPDATED: "FAQ updated successfully",
  UPDATE_FAILED: "Failed to update FAQ",
  DELETED: "FAQ deleted successfully",
  DELETE_FAILED: "Failed to delete FAQ",
  NOT_FOUND: "FAQ not found",
};

export const authMessages = {
  SIGNUP_SUCCESS: "User registered successfully. Please verify your email with the OTP sent.",
  SIGNUP_FAILED: "Failed to register user",
  EMAIL_EXISTS: "User with this email already exists",
  PHONE_EXISTS: "User with this phone number already exists",
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Invalid email or password",
  USER_NOT_FOUND: "User not found",
  USER_NOT_VERIFIED: "Please verify your email first",
  USER_INACTIVE: "Your account is inactive",
  OTP_SENT: "OTP sent to your email",
  OTP_SEND_FAILED: "Failed to send OTP",
  OTP_INVALID: "Invalid OTP",
  OTP_EXPIRED: "OTP has expired",
  VERIFICATION_SUCCESS: "Email verified successfully",
  VERIFICATION_FAILED: "Failed to verify email",
  FORGET_PASSWORD_SUCCESS: "Password reset link sent to your email",
  FORGET_PASSWORD_FAILED: "Failed to send reset link",
  RESET_PASSWORD_SUCCESS: "Password reset successfully",
  RESET_PASSWORD_FAILED: "Failed to reset password",
  TOKEN_INVALID: "Invalid or expired token",
  UNAUTHORIZED: "Unauthorized access",
};

export const userMessages = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_TOKEN: "Invalid or expired token",
};

export const adminMessages = {
  UNAUTHORIZED: "Unauthorized access",
  INVALID_TOKEN: "Invalid or expired token",
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
  REQUIRED_FIELD: (field) => `${field} is required`,
  INVALID_FIELD: (field) => `Invalid ${field}`,
};