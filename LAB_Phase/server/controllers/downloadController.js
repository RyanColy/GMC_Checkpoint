const https = require("https");
const http  = require("http");

const ALLOWED_HOST = "res.cloudinary.com";

const downloadProxy = (req, res, next) => {
  const { url, filename } = req.query;

  if (!url) return res.status(400).json({ message: "Missing url" });

  let parsed;
  try { parsed = new URL(url); } catch {
    return res.status(400).json({ message: "Invalid url" });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return res.status(403).json({ message: "Forbidden host" });
  }

  const safe = (filename || "file").replace(/[^a-zA-Z0-9._\-\s]/g, "_");
  const client = parsed.protocol === "https:" ? https : http;

  client.get(url, (upstream) => {
    if (upstream.statusCode >= 400) {
      upstream.resume();
      return res.status(502).json({ message: "Upstream error" });
    }
    const contentType = upstream.headers["content-type"] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safe}"`);
    if (upstream.headers["content-length"]) {
      res.setHeader("Content-Length", upstream.headers["content-length"]);
    }
    upstream.pipe(res);
  }).on("error", next);
};

module.exports = { downloadProxy };
