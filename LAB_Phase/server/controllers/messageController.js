const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Group = require("../models/Group");

const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const messages = await Message.find({ conversationId })
      .populate("sender", "displayName handle avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json(messages.reverse());
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages };
