// ================== Response Helper ==================
const errorResponse = (
    res,
    message = "Something went wrong",
    statusCode = 500,
    errors = null
) => {
    return res.status(statusCode).json({
        status: false,
        statusCode,
        message: message, //cp
        errors,
    });
};


// ================== Success Response Helper ==================
const successResponse = (
    res,
    message = "Success",
    data = {},
    statusCode = 200
) => {
    return res.status(statusCode).json({
        status: true,
        statusCode,
        message: message, // cp
        data,
    });
};

// ================== Exporting Response Helpers ==================
export { errorResponse, successResponse };