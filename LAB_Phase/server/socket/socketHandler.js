const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Group = require("../models/Group");

const onlineUsers = new Map(); // userId -> socketId

const socketHandler = (io) => {
  // Auth middleware for sockets
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Auth required"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() });
    io.emit("user:status", { userId: socket.userId, isOnline: true });

    // Join all conversation and group rooms on connect
    const [conversations, groups] = await Promise.all([
      Conversation.find({ participants: socket.userId }),
      Group.find({ members: socket.userId }),
    ]);
    conversations.forEach((c) => socket.join(`conv:${c._id}`));
    groups.forEach((g) => socket.join(`group:${g._id}`));

    socket.on("message:send", async (data) => {
      const { conversationId, conversationType, type, content, fileUrl, fileName, fileSize, mimeType, duration } = data;

      const message = await Message.create({
        type, content, fileUrl, fileName, fileSize, mimeType, duration,
        sender: socket.userId, conversationId, conversationType,
      });

      const Model = conversationType === "Conversation" ? Conversation : Group;
      await Model.findByIdAndUpdate(conversationId, { lastMessage: message._id, updatedAt: new Date() });

      const populated = await message.populate("sender", "displayName handle avatar");
      const room = conversationType === "Conversation" ? `conv:${conversationId}` : `group:${conversationId}`;
      io.to(room).emit("message:receive", populated);

      // Mark as delivered to connected recipients
      const roomSockets = await io.in(room).fetchSockets();
      const deliveredTo = roomSockets.map((s) => s.userId).filter((id) => id !== socket.userId);
      if (deliveredTo.length > 0) {
        await Message.findByIdAndUpdate(message._id, { $addToSet: { deliveredTo: { $each: deliveredTo } } });
        socket.emit("message:delivered", { messageId: message._id, deliveredTo });
      }
    });

    socket.on("message:read", async ({ messageId, conversationId, conversationType }) => {
      await Message.findByIdAndUpdate(messageId, { $addToSet: { readBy: socket.userId } });
      const room = conversationType === "Conversation" ? `conv:${conversationId}` : `group:${conversationId}`;
      socket.to(room).emit("message:read-update", { messageId, readBy: socket.userId });
    });

    socket.on("message:delete", async ({ messageId, conversationId, conversationType }) => {
      const message = await Message.findById(messageId);
      if (!message || message.sender.toString() !== socket.userId) return;
      await Message.findByIdAndUpdate(messageId, { type: "deleted", content: null, fileUrl: null, fileName: null });
      const room = conversationType === "Conversation" ? `conv:${conversationId}` : `group:${conversationId}`;
      io.to(room).emit("message:deleted", { messageId });
    });

    socket.on("typing:start", ({ conversationId, conversationType }) => {
      const room = conversationType === "Conversation" ? `conv:${conversationId}` : `group:${conversationId}`;
      socket.to(room).emit("typing:update", { userId: socket.userId, isTyping: true, conversationId });
    });

    socket.on("typing:stop", ({ conversationId, conversationType }) => {
      const room = conversationType === "Conversation" ? `conv:${conversationId}` : `group:${conversationId}`;
      socket.to(room).emit("typing:update", { userId: socket.userId, isTyping: false, conversationId });
    });

    // Join a newly created group room without reconnecting
    socket.on("group:join-room", async ({ groupId }) => {
      const group = await Group.findOne({ _id: groupId, members: socket.userId });
      if (group) socket.join(`group:${groupId}`);
    });

    socket.on("disconnect", async () => {
      onlineUsers.delete(socket.userId);
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      io.emit("user:status", { userId: socket.userId, isOnline: false, lastSeen: new Date() });
    });
  });

  return onlineUsers;
};

module.exports = socketHandler;
