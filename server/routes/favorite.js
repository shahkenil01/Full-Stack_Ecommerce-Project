const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorite");

router.post("/add", async (req, res) => {
  try {
    const { productId, userEmail } = req.body;

    if (!productId || !userEmail) {
      return res.status(400).json({ message: "productId and userEmail required" });
    }

    const existing = await Favorite.findOne({ productId, userEmail });

    if (existing) {
      return res.status(200).json({
        message: "Already in favourites",
        favorite: existing,
      });
    }

    const favorite = new Favorite(req.body);
    const saved = await favorite.save();

    res.status(201).json({
      message: "Added",
      favorite: saved,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Already in favourites" });
    }

    res.status(500).json({ message: error.message });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const items = await Favorite.find({ userEmail: req.params.email });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Favorite.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.status(200).json({ message: "Favorite deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/remove", async (req, res) => {
  const { productId, userEmail } = req.body;
  try {
    await Favorite.findOneAndDelete({ productId, userEmail });
    res.status(200).json({ message: "Removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing favorite", error: error.message });
  }
});

module.exports = router;
