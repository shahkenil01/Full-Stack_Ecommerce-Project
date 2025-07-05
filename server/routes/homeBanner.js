const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const HomeBanner = require("../models/homeBanner");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// GET: all banners
router.get("/", async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (error) {
    console.error("Fetch banner error:", error);
    res.status(500).json({ message: "Failed to fetch banners" });
  }
});

// GET: /api/homeBanner/:id
router.get("/:id", async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Slide not found" });
    res.status(200).json(banner);
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST: create banner
router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const pLimit = await import("p-limit").then((mod) => mod.default);
    const limit = pLimit(2);

    const { images } = req.body;

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    const uploads = images.map((img) =>
      limit(async () => {
        // Upload whether it's a URL or base64/blob
        const result = await cloudinary.uploader.upload(img, {
          folder: "homeBanner", // ✅ Optional folder
          fetch_format: "auto",
        });
        return result.secure_url;
      })
    );

    const uploadedUrls = await Promise.all(uploads);

    const banner = new HomeBanner({
      image: uploadedUrls[0], // only first image is used now
    });

    await banner.save();

    return res.status(201).json({ success: true, message: "Banner created", data: banner });
  } catch (error) {
    console.error("Create banner error:", error);
    return res.status(500).json({ success: false, message: "Failed to create banner" });
  }
});

// PUT: update banner
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { images } = req.body;
    if (!images || !images.length) {
      return res.status(400).json({ success: false, message: "Image required" });
    }

    const newImg = images[0];
    let finalImage = newImg;

    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Remove old image if on cloudinary
    if (banner.image.includes("res.cloudinary.com")) {
      const publicId = banner.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`homeBanner/${publicId}`);
    }

    // Upload new if not URL
    if (!newImg.startsWith("http")) {
      const uploadRes = await cloudinary.uploader.upload(newImg);
      finalImage = uploadRes.secure_url;
    }

    banner.image = finalImage;
    await banner.save();

    return res.status(200).json({ success: true, message: "Banner updated", data: banner });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE: delete banner
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    // Delete cloudinary image
    if (banner.image.includes("res.cloudinary.com")) {
      const publicId = banner.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await HomeBanner.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: "Banner deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
