const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    let dataUri;

    if (req.file) {
      const fileBuffer = req.file.buffer;
      const base64 = fileBuffer.toString("base64");
      dataUri = `data:${req.file.mimetype};base64,${base64}`;
    } else if (req.body.url) {
      dataUri = req.body.url;
    } else {
      return res.status(400).json({ message: "No image provided." });
    }

    const result = await cloudinary.uploader.upload(dataUri, {
      upload_preset: "ecommerce",
    });

    res.status(200).json({ secure_url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});


module.exports = router;
