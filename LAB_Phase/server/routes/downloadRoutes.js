const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { downloadProxy } = require("../controllers/downloadController");

const router = express.Router();

// GET /api/download?url=<cloudinary-url>&filename=<original-name>
router.get("/", protect, downloadProxy);

module.exports = router;
