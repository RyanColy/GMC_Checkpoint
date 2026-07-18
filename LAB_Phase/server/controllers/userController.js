const User = require("../models/User");

const searchUsers = async (req, res, next) => {
  try {
    const query = req.query.q?.replace(/^@/, "").toLowerCase();
    if (!query || query.length < 2) return res.json([]);

    const users = await User.find({
      $or: [
        { handle: { $regex: query, $options: "i" } },
        { displayName: { $regex: query, $options: "i" } },
      ],
      _id: { $ne: req.user._id },
    })
      .select("displayName handle avatar isOnline")
      .limit(10);

    res.json(users);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { displayName, bio } = req.body;
    const update = {};

    if (displayName) update.displayName = displayName;
    if (bio !== undefined) update.bio = bio;

    // If a file was uploaded, req.file.path is the Cloudinary URL
    if (req.file) update.avatar = req.file.path;

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { searchUsers, getProfile, updateProfile };
