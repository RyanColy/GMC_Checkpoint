require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN, methods: ["GET", "POST"] },
});

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/upload", require("./routes/uploadRoutes"));
app.use("/api/download", require("./routes/downloadRoutes"));

// Socket handlers
require("./socket/socketHandler")(io);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only start listening when run directly (not when imported by tests)
if (require.main === module) {
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app, httpServer };
