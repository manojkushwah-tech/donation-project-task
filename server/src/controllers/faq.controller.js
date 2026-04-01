import {
  createFAQService,
  getAllFAQsService,
  getFAQByIdService,
  updateFAQService,
  deleteFAQService,
} from "../services/faq.service.js";
import {
  errorResponse,
  successResponse,
} from "../helper/response.helper.js";
import {
  faqMessages,
  httpStatus,
  roles,
} from "../helper/constants.js";
import { getPagination, } from "../utils/pagination.js";

// ========================= Create FAQ =========================
export const createFAQ = async (req, res) => {
  try {

    const data = req.validatedData;
    await createFAQService(data);
    return successResponse(
      res,
      faqMessages.CREATED,
      {},
      httpStatus.CREATED
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || faqMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get All FAQs =========================
export const getAllFAQs = async (req, res) => {
  try {
    const isAdmin = req.user?.role === roles.ADMIN;

    // ✅ Pagination
    const { page, limit, skip } = getPagination(req.query);

    // 🎯 Base condition
    let condition = isAdmin ? {} : { status: true };


    const { sort = 'desc', question, answer, status } = req.query;
    if (question) condition.question = { $regex: question, $options: "i" };
    if (answer) condition.answer = { $regex: answer, $options: "i" };
    if (isAdmin) {
      if (status === "true") condition.status = true;
      else if (status === "false") condition.status = false;
    }

    const { faqs, total } = await getAllFAQsService({
      condition,
      skip,
      limit,
      sort,
    });

    return successResponse(
      res,
      faqMessages.FETCHED_ALL,
      {
        faqs,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || faqMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get FAQ By ID =========================
export const getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to fetch FAQ by ID
    const faq = await getFAQByIdService(id, req.user?.role === roles.ADMIN);
    return successResponse(
      res,
      faqMessages.FETCHED,
      faq,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || faqMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Update FAQ =========================
export const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.validatedData;
    // Implement logic to update FAQ by ID with new data
    
    await updateFAQService(id, data);

    return successResponse(
      res,
      faqMessages.UPDATED,
      {},
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || faqMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Delete FAQ =========================
export const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to delete FAQ by ID
    await deleteFAQService(id);
    return successResponse(
      res,
      faqMessages.DELETED,
      {}, // Replace with actual data
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || faqMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};