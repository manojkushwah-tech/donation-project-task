import { FAQ } from "../models/index.js";
import ApiError from "../utils/ApiError.js";
import {
  faqMessages,
  httpStatus,
} from "../helper/constants.js";

// ================= Create New FAQ =================
export const createFAQService = async (data) => {
  const { question, answer } = data;

  try {
    // ================= Check Duplicate =================
    const existingFAQ = await FAQ.findOne({
      question: { $regex: `^${question}$`, $options: "i" } // ✅ case-insensitive
    });

    if (existingFAQ) {
      throw new ApiError(faqMessages.ALREADY_EXISTS, httpStatus.CONFLICT);
    }

    // ================= Create FAQ =================
    const newFAQ = new FAQ({
      question,
      answer,
    });

    const savedFAQ = await newFAQ.save();
    return savedFAQ;

  } catch (error) {
    // ✅ Preserve original error
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      faqMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get All FAQs with Optional Filtering =================
export const getAllFAQsService = async ({
  condition = {},
  skip = 0,
  limit = 10,
  sort = { createdAt: -1 },
}) => {
  try {
    const [faqs, total] = await Promise.all([
      FAQ.find(condition)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      FAQ.countDocuments(condition),
    ]);

    return {
      faqs,
      total,
    };
  } catch (error) {
    throw new ApiError(
      faqMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get Single FAQ by ID =================
export const getFAQByIdService = async (id, isAdmin ) => {
  try {
    const faq = await FAQ.findOne({ _id: id, ...(isAdmin ? {} : { status: true }) });
    if (!faq) {
      throw new ApiError(faqMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return faq;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      faqMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Update FAQ by ID =================
export const updateFAQService = async (id, data) => {
  try {
    // console.log("Updating FAQ with ID:", id);
    const faq = await FAQ.findById(id);
    // console.log("FAQ found:", faq);
    if (!faq) {
      throw new ApiError(faqMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    faq.question = data.question || faq.question;
    faq.answer = data.answer || faq.answer;
    if (data.status !== undefined && typeof data.status === "boolean") {
      faq.status = data.status;
    }
    const updatedFAQ = await faq.save();
    return updatedFAQ;
  } catch (error) {
    if (error instanceof ApiError) {
      // console.error("Error in updateFAQService:", error);
      throw error;
    }
    // console.error("Unexpected error in updateFAQService:", error);
    throw new ApiError(
      faqMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Delete FAQ by ID =================
export const deleteFAQService = async (id) => {
  try {
    const faq = await FAQ.findById(id);
    if (!faq) {
      throw new ApiError(faqMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    await FAQ.findByIdAndDelete(id);
    return;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      faqMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};