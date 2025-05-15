// at top
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/upload", async (req, res) => {
  try {
    const { file } = req.body;

    if (!file) return res.status(400).json({ message: "No file received" });

    const result = await cloudinary.uploader.upload(file, {
      upload_preset: "ecommerce"
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

module.exports = router;
