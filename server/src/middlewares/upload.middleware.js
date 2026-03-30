import multer from "multer";
const storage =multer.memoryStorage();

// ========================= Multer Configuration for Image Uploads =========================
const upload = multer({ storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only images are allowed."), false);
        }
    },
});

export { upload };