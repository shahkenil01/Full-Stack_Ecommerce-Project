// routes/cashfree.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/create-order", async (req, res) => {
  try {
    const payload = {
      customer_details: {
        customer_id: "12345",
        customer_email: "test@example.com",
        customer_phone: "9999999999",
      },
      order_amount: req.body.amount,
      order_currency: "INR",
      order_id: "order_" + Date.now()
    };

    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      payload,
      { headers }
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router; // ✅ CommonJS style
