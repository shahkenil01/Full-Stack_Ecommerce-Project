const express = require('express');
const Review = require('../models/review');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();

// Create review
router.post("/add", verifyToken, isAdmin, async (req, res) => {
  try {
    const review = new Review(req.body);
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews by product ID
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete review by ID
router.delete("/:reviewId", verifyToken, isAdmin, async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.reviewId);
    if (!deleted) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/reply/:reviewId", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userName, replyText } = req.body;

    if (!userName || !replyText) {
      return res.status(400).json({ message: "Missing reply text or userName" });
    }

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.replies.push({ userName, replyText });
    await review.save();

    res.status(200).json({ message: "Reply added", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/reply/:reviewId/:replyIndex", verifyToken, isAdmin, async (req, res) => {
  try {
    const { userName, replyText } = req.body;
    const { reviewId, replyIndex } = req.params;

    if (!replyText) return res.status(400).json({ message: "Reply text is required" });

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.replies[replyIndex].replyText = replyText;
    review.replies[replyIndex].userName = userName || review.replies[replyIndex].userName;
    await review.save();

    res.status(200).json({ message: "Reply updated", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/reply/:reviewId/:replyIndex", verifyToken, isAdmin, async (req, res) => {
  try {
    const { reviewId, replyIndex } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.replies.splice(replyIndex, 1);
    await review.save();

    res.status(200).json({ message: "Reply deleted successfully", review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;