const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/storage");
const {
  createGroup, getGroup, updateGroup,
  addMember, removeMember, leaveGroup, getUserGroups,
} = require("../controllers/groupController");

router.get("/", protect, getUserGroups);
router.post("/", protect, createGroup);
router.get("/:id", protect, getGroup);
router.put("/:id", protect, upload.single("avatar"), updateGroup);
router.post("/:id/members", protect, addMember);
router.delete("/:id/members/:userId", protect, removeMember);
router.delete("/:id/leave", protect, leaveGroup);

module.exports = router;
