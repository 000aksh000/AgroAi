import fs from "fs";
import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/env.js";
import { AppError } from "./errorHandler.js";
if (!fs.existsSync(ENV.UPLOAD_DIR)) {
  fs.mkdirSync(ENV.UPLOAD_DIR, { recursive: true });
}
const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, ENV.UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const uniqueKey = `leaf-${uuidv4()}${ext}`;
    cb(null, uniqueKey);
  }
});
const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Invalid file type. Only JPEG, PNG, and WEBP image formats are supported for plant leaf analysis.",
        400,
        "INVALID_IMAGE_FORMAT"
      )
    );
  }
};
export const leafImageUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: ENV.MAX_FILE_SIZE_BYTES
  }
});
