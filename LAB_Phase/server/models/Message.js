const mongoose = require("mongoose");

const MESSAGE_TYPES = ["text", "voice", "image", "video", "audio", "file", "deleted"];

const messageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: MESSAGE_TYPES, required: true },
    content: { type: String, default: null },
    fileUrl: { type: String, default: null },
    fileName: { type: String, default: null },
    fileSize: { type: Number, default: null },
    mimeType: { type: String, default: null },
    duration: { type: Number, default: null },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "conversationType",
    },
    conversationType: {
      type: String,
      enum: ["Conversation", "Group"],
      required: true,
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deliveredTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Index for fast conversation history queries
messageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);
