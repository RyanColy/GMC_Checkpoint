const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/storage");
const { uploadFile } = require("../controllers/uploadController");

router.post("/", protect, upload.single("file"), uploadFile);

module.exports = router;
