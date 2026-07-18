const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const register = async (req, res, next) => {
  try {
    const { displayName, handle, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { handle }] });
    if (existing) {
      return res.status(400).json({ message: "Email or @handle already taken" });
    }

    const user = await User.create({ displayName, handle, email, password });
    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, displayName: user.displayName, handle: user.handle, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: { id: user._id, displayName: user.displayName, handle: user.handle, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  const u = req.user;
  res.json({ id: u._id, displayName: u.displayName, handle: u.handle, avatar: u.avatar });
};

module.exports = { register, login, getMe };
