const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/storage");
const { searchUsers, getProfile, updateProfile } = require("../controllers/userController");

router.get("/search", protect, searchUsers);
router.get("/:id", protect, getProfile);
router.put("/profile", protect, upload.single("avatar"), updateProfile);

module.exports = router;
