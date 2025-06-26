const express = require("express");
const router = express.Router();
const axios = require("axios");
const Order = require("../models/order");
const TempOrder = require("../models/tempOrder");

// Helper delay function
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry logic to find temp order
async function findTempOrderWithRetry(token, retries = 5, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    const found = await TempOrder.findOne({ token });
    if (found) return found;
    await wait(delayMs);
  }
  return null;
}

router.post("/create-order", async (req, res) => {
  try {
    const { email, phoneNumber, amount, token } = req.body;
    if (!email || !phoneNumber || !amount || !token) {
      return res.status(400).json({ error: "Missing required fields or payload" });
    }

    const cleanCustomerId = email.replace(/[^a-zA-Z0-9_-]/g, "_");
    const orderId = "order_" + Date.now();

    const paymentPayload = {
      customer_details: {
        customer_id: cleanCustomerId,
        customer_email: email,
        customer_phone: phoneNumber,
        customer_name: "Guest User"
      },
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      order_meta: {
        return_url: `${process.env.FRONTEND_URL}/order?paid=true&token=${token}`
      },
      order_tags: {
        token: token
      }
    };

    const headers = {
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-api-version": "2022-09-01",
      "Content-Type": "application/json",
    };

    const response = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      paymentPayload,
      { headers }
    );

    res.status(200).json({ ...response.data, order_id: orderId });
  } catch (err) {
    const message =
      err.response?.data?.message || err.response?.data || err.message;
    res.status(400).json({ error: message });
  }
});

// ✅ Webhook Handler Route
router.post("/webhook", async (req, res) => {
  console.log("🔥 Webhook triggered! 🔥");
  console.log("📦 Full Webhook Body:", JSON.stringify(req.body, null, 2));
  try {
    const event = req.body?.type;
    const data = req.body?.data;

    if (event !== "PAYMENT_SUCCESS_WEBHOOK" || !data?.payment) {
      console.log("📛 Ignored non-success webhook");
      return res.status(200).send("ignored");
    }

    const payment = data.payment;
    const order = data.order;

    const payment_id = payment.cf_payment_id;
    const order_id = order.order_id;
    const payment_method = payment.payment_method;
    const payment_amount = payment.payment_amount;
    const token = order?.order_tags?.token;

    console.log("🧩 Token received:", token);
    console.log("💳 Payment ID:", payment_id);
    console.log("📦 Order ID:", order_id);

    if (!token) {
      console.log("❌ No token found, skipping...");
      return res.status(200).send("no token, skip");
    }

    const raw = await findTempOrderWithRetry(token);
    console.log("🔍 DB Token Query Result:", raw);
    if (!raw) {
      console.log("⚠️ Temp order not found in DB for token:", token);
      return res.status(200).send("no order data, skip");
    }

    await TempOrder.deleteOne({ token });

    const method =
      payment_method?.card?.type ||
      payment_method?.upi?.type ||
      payment_method?.app?.provider ||
      payment_method?.netbanking?.channel ||
      "UNKNOWN";

    const formattedProducts = raw.cartItems.map((item) => ({
      productId: item._id || item.productId,
      name: item.name || item.productTitle,
      image: item.images?.[0] || item.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
    }));

    const newOrder = new Order({
      paymentId: payment_id,
      paymentMethod: method,
      orderId: order_id,
      products: formattedProducts,
      name: raw.formFields.fullName || "Guest",
      phone: raw.formFields.phoneNumber || "0000000000",
      email: raw.formFields.email || "noemail@dummy.com",
      address: `${raw.formFields.streetAddressLine1 || ""}, ${raw.formFields.streetAddressLine2 || ""}`,
      city: raw.formFields.city || "",
      state: raw.formFields.state || "",
      zipCode: raw.formFields.zipCode || "",
      country: raw.formFields.country || "",
      totalAmount: payment_amount || 0,
    });

    console.log("📝 Order to be saved:", newOrder.toObject());
    console.log("💳 Payment method used:", method);

    await newOrder.save();
    console.log("✅ Order saved to DB for:", newOrder.email);
    res.status(200).send("Order saved via webhook");
  } catch (err) {
    console.error("🔥 Webhook Save Failed FULL:", err);
    res.status(500).send("error ignored");
  }
});

module.exports = router;
