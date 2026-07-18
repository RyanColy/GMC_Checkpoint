const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { getOrCreate, getConversations } = require("../controllers/conversationController");

router.get("/", protect, getConversations);
router.post("/", protect, getOrCreate);

module.exports = router;
