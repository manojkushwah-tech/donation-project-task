import { Committee } from "../models/index.js";
import { uploadImage, deleteImage } from "./imageKit.services.js";
import ApiError from "../utils/ApiError.js";
import {
  committeeMessages,
  httpStatus,
  image
} from "../helper/constants.js";

// ================= Create New Committee Member =================
export const createCommitteeService = async (data, file) => {
  const { name, designation } = data;

  let imageData = null;

  // ================= Upload Image =================
  if (file) {
    try {
      imageData = await uploadImage(file, "committees");
    } catch (error) {
      throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
    }
  }

  try {
    // ================= Check Duplicate =================
    const existingCommittee = await Committee.findOne({
      name: { $regex: `^${name}$`, $options: "i" } // ✅ case-insensitive
    });

    if (existingCommittee) {
      throw new ApiError(committeeMessages.ALREADY_EXISTS, httpStatus.CONFLICT);
    }

    // ================= Create Committee Member =================
    const newCommittee = new Committee({
      name,
      designation,
      image: imageData,
    });

    const savedCommittee = await newCommittee.save();
    return savedCommittee;

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
      committeeMessages.CREATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get All Committee Members with Optional Filtering =================
export const getAllCommitteesService = async ({
  condition = {},
  skip = 0,
  limit = 10,
  sort = { createdAt: -1 },
}) => {
  try {
    const [committees, total] = await Promise.all([
      Committee.find(condition)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),

      Committee.countDocuments(condition),
    ]);

    const transformedCommittees = committees.map((committee) => ({
      ...committee,
      image: committee.image?.url || null,
    }));

    return {
      committees: transformedCommittees,
      total,
    };

    return {
      committees,
      total,
    };
  } catch (error) {
    console.error("Error in getAllCommitteesService:", error);
    throw new ApiError(
      committeeMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Get Single Committee Member by ID =================
export const getCommitteeByIdService = async (id, isAdmin) => {
  try {
    const committee = await Committee.findOne({ _id: id, ...(isAdmin ? {} : { status: true }) }).lean();
    committee.image = committee.image.url; // ✅ Return only the image URL
    console.log("Committee member found:", committee);
    if (!committee) {
      throw new ApiError(committeeMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }
    return committee;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      committeeMessages.FETCH_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Update Committee Member by ID =================
export const updateCommitteeService = async (id, data, file) => {
  try {
    console.log("Updating committee member with ID:", id);
    const committee = await Committee.findById(id);
    console.log("Committee member found:", committee);
    if (!committee) {
      throw new ApiError(committeeMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    let imageData = committee.image;
    // ================= Upload New Image =================
    if (file) {
      try {
        imageData = await uploadImage(file, "committees");
        // ================= Delete Old Image =================
        if (committee.image?.fileId) {
          const result = await deleteImage(committee.image.fileId);
          console.log("Image deleted", (result ? "successfully" : "failed"));
        }
      }
      catch (error) {
        console.error("Image upload failed:", error);
        throw new ApiError(image.messages.UPLOAD_FAILED, httpStatus.BAD_REQUEST);
      }
    }

    committee.name = data.name || committee.name;
    committee.designation = data.designation || committee.designation;
    committee.image = imageData;
    if (data.status !== undefined && typeof data.status === "boolean") {
      committee.status = data.status;
    }
    const updatedCommittee = await committee.save();
    return updatedCommittee;
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("Error in updateCommitteeService:", error);
      throw error;
    }
    console.error("Unexpected error in updateCommitteeService:", error);
    throw new ApiError(
      committeeMessages.UPDATE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

// ================= Delete Committee Member by ID =================
export const deleteCommitteeService = async (id) => {
  try {
    const committee = await Committee.findById(id);
    if (!committee) {
      throw new ApiError(committeeMessages.NOT_FOUND, httpStatus.NOT_FOUND);
    }

    // ================= Delete Image =================
    if (committee.image?.fileId) {
      const result = await deleteImage(committee.image.fileId);
      console.log("Image deleted", (result ? "successfully" : "failed"));
    }

    await Committee.findByIdAndDelete(id);
    return;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      committeeMessages.DELETE_FAILED,
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};