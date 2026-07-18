const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Strip codec params before comparing: "audio/webm;codecs=opus" → "audio/webm"
const baseMime = (mimetype) => mimetype.split(";")[0].trim();

// Cloudinary resource types:
// - "image" for images
// - "video" for video files only (audio-only webm is NOT supported)
// - "raw" for audio and documents (served as-is with correct Content-Type)
const getResourceType = (mimetype) => {
  const base = baseMime(mimetype);
  if (base.startsWith("image/")) return "image";
  if (base.startsWith("video/")) return "video";
  return "raw";
};

const ALLOWED_BASE_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "video/mp4", "video/quicktime",
  "audio/mpeg", "audio/wav", "audio/webm", "audio/ogg", "audio/mp4",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
]);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    return {
      folder: "nextalk/uploads",
      resource_type: getResourceType(file.mimetype),
      public_id: `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`,
      use_filename: false,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_BASE_TYPES.has(baseMime(file.mimetype))) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

module.exports = { upload, cloudinary };
