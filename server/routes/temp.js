const TempOrder = require("./models/tempOrder");

app.post("/save-temp", async (req, res) => {
  try {
    const { token, cartItems, formFields } = req.body;
    if (!token || !cartItems || !formFields) {
      return res.status(400).json({ error: "Missing token/cart/form" });
    }

    await TempOrder.findOneAndUpdate(
      { token },
      { cartItems, formFields },
      { upsert: true }
    );

    res.status(200).json({ msg: "saved to db" });
  } catch (e) {
    res.status(500).json({ error: "failed to save temp" });
  }
});
