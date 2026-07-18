const Conversation = require("../models/Conversation");

const getOrCreate = async (req, res, next) => {
  try {
    const { participantId } = req.body;
    const me = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [me, participantId], $size: 2 },
    })
      .populate("participants", "displayName handle avatar isOnline lastSeen")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "displayName" } });

    if (!conversation) {
      conversation = await Conversation.create({ participants: [me, participantId] });
      await conversation.populate("participants", "displayName handle avatar isOnline lastSeen");
    }

    res.json(conversation);
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate("participants", "displayName handle avatar isOnline lastSeen")
      .populate({ path: "lastMessage", populate: { path: "sender", select: "displayName" } })
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrCreate, getConversations };
