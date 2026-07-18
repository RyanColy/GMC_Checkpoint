const uploadFile = (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file received" });

  res.json({
    fileUrl: req.file.path,           // Cloudinary secure URL
    fileName: req.file.originalname,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  });
};

module.exports = { uploadFile };
