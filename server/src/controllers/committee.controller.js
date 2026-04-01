import {
  createCommitteeService,
  getAllCommitteesService,
  getCommitteeByIdService,
  updateCommitteeService,
  deleteCommitteeService,
} from "../services/committee.service.js";
import {
  errorResponse,
  successResponse,
} from "../helper/response.helper.js";
import {
  committeeMessages,
  httpStatus,
  roles,
} from "../helper/constants.js";
import { getPagination, } from "../utils/pagination.js";

// ========================= Create Committee Member =========================
export const createCommittee = async (req, res) => {
  try {

    const data = req.validatedData;
    await createCommitteeService(data, req.file);
    return successResponse(
      res,
      committeeMessages.CREATED,
      {},
      httpStatus.CREATED
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || committeeMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get All Committee Members =========================
export const getAllCommittees = async (req, res) => {
  // console.log("Fetching committees with query:", req.query);
  try {
    const isAdmin = req.user?.role === roles.ADMIN;

    // ✅ Pagination
    const { page, limit, skip } = getPagination(req.query);

    // 🎯 Base condition
    let condition = isAdmin ? {} : { status: true };


    const { sort = 'desc', name, designation, status } = req.query;
    if (name) condition.name = { $regex: name, $options: "i" };
    if (designation) condition.designation = { $regex: designation, $options: "i" };
    if (isAdmin) {
      if (status === "true") condition.status = true;
      else if (status === "false") condition.status = false;
    }

    let { committees, total } = await getAllCommitteesService({
      condition,
      skip,
      limit,
      sort,
    });

    return successResponse(
      res,
      committeeMessages.FETCHED_ALL,
      {
        committees,
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
    // console.error("Error fetching committees:", error);
    return errorResponse(
      res,
      error.message || committeeMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Get Committee Member By ID =========================
export const getCommitteeById = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to fetch committee member by ID
    const committee = await getCommitteeByIdService(id, req.user?.role === roles.ADMIN);
    return successResponse(
      res,
      committeeMessages.FETCHED,
      committee,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || committeeMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Update Committee Member =========================
export const updateCommittee = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.validatedData;
    // Implement logic to update committee member by ID with new data and file

    await updateCommitteeService(id, data, req.file);

    return successResponse(
      res,
      committeeMessages.UPDATED,
      {},
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || committeeMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ========================= Delete Committee Member =========================
export const deleteCommittee = async (req, res) => {
  try {
    const { id } = req.params;
    // Implement logic to delete committee member by ID
    await deleteCommitteeService(id);
    return successResponse(
      res,
      committeeMessages.DELETED,
      {}, // Replace with actual data
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || committeeMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};