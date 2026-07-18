const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { getMessages } = require("../controllers/messageController");

router.get("/:conversationId", protect, getMessages);

module.exports = router;
