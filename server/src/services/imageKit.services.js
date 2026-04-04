import imagekit from "../config/imagekit.config.js";
import {image} from "../helper/constants.js";

const validateFile = (file) => {
  if (!file) throw new Error(image.messages.NO_FILE_PROVIDED);
  if (!Object.values(image.allowedMime).includes(file.mimetype)) {
    throw new Error(image.messages.INVALID_TYPE);
  }
};

const uploadImage = async (file, folder = "images") => {
  try {
    console.log("Uploading image...", file);
    validateFile(file);
    console.log("File validated, proceeding to upload...");

    // Convert buffer to base64 string for ImageKit
    const base64File = file.buffer.toString('base64');
    console.log("Base64 file length:", base64File.length);

    const uploadParams = {
      file: base64File,
      fileName: `${Date.now()}-${file.originalname}`,
      folder: folder,
      useUniqueFileName: false,
    };
    console.log("Upload params keys:", Object.keys(uploadParams));

    const response = await imagekit.upload(uploadParams);

    console.log("ImageKit response received");

    return {
      fileId: response.fileId,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl,
      success:true
    };
  } catch (error) {
    // console.error("ImageKit upload error:", error.message);
    // console.error("Error stack:", error.stack);
    throw error;
  }
};

const uploadMultipleImages = async (files = [], folder = "images") => {
  try {
    if (!files.length) throw new Error(image.messages.NO_FILE);

    const uploads = files.map((file) => uploadImage(file, folder));
    return Promise.all(uploads);
  } catch (error) {
    console.error("ImageKit multiple upload error:", error.message);
    throw error;
  }
};

const deleteImage = async (fileId) => {
  try {
    if (!fileId) throw new Error(image.messages.FILE_ID_REQUIRED);

    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error("ImageKit delete error:", error.message);
    return false;
  }
};

export { uploadImage, uploadMultipleImages, deleteImage };