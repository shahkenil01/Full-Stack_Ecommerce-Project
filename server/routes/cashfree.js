const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/create-order", async (req, res) => {
  try {
    const { email, phoneNumber, amount } = req.body;

    if (!email || !phoneNumber || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const cleanCustomerId = email.replace(/[^a-zA-Z0-9_-]/g, "_");

    const payload = {
      customer_details: {
        customer_id: cleanCustomerId,
        customer_email: email,
        customer_phone: phoneNumber,
      },
      order_amount: amount,
      order_currency: "INR",
      order_id: "order_" + Date.now(),
      order_meta: {
        return_url: "http://localhost:3005/order?order_id={order_id}",
      },
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
    const message =
      err.response?.data?.message || err.response?.data || err.message;
    res.status(400).json({ error: message });
  }
});

module.exports = router;
