const express = require("express");
const router = express.Router();
const axios = require("axios");
const Order = require("../models/order");
const Cart = require("../models/Cart");
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
  try {
    const event = req.body?.type;
    const data = req.body?.data;

    if (event !== "PAYMENT_SUCCESS_WEBHOOK" || !data?.payment) {
      return res.status(200).send("ignored");
    }

    const payment = data.payment;
    const order = data.order;

    const payment_id = payment.cf_payment_id;
    const order_id = order.order_id;
    const payment_method = payment.payment_method;
    const payment_amount = payment.payment_amount;
    const token = order?.order_tags?.token;

    if (!token) {
      return res.status(200).send("no token, skip");
    }

    const raw = await findTempOrderWithRetry(token);
    if (!raw) {
      return res.status(200).send("no order data, skip");
    }

    await TempOrder.deleteOne({ token });

    let method = "UNKNOWN";
    
    if (payment_method) {
      // Card Payments
      if (payment_method.card) {
        const card = payment_method.card;
        const type = card.card_type?.replace(/_/g, " ") || "";
        const network = card.card_network || "";
        method = `${type} ${network}`.trim() || "Credit/Debit Card";
      }
      // UPI Payments
      else if (payment_method.upi) {
        const upiType = payment_method.upi.type || "";
        method = `UPI${upiType ? ` (${upiType})` : ''}`;
      }
      // Netbanking
      else if (payment_method.netbanking) {
        method = `NetBanking (${payment_method.netbanking.bank_name || payment_method.netbanking.channel || ''})`;
      }
      // Wallets
      else if (payment_method.wallet) {
        method = `Wallet (${payment_method.wallet.provider || ''})`;
      }
      // PayLater
      else if (payment_method.paylater) {
        method = `PayLater (${payment_method.paylater.provider || ''})`;
      }
      // EMI
      else if (payment_method.emi) {
        method = `EMI (${payment_method.emi.provider || ''})`;
      }
      // Prepaid Cards
      else if (payment_method.prepaid_card) {
        method = `Prepaid Card (${payment_method.prepaid_card.provider || ''})`;
      }
      // Direct Debit
      else if (payment_method.debit_emi) {
        method = `Debit EMI (${payment_method.debit_emi.provider || ''})`;
      }
      // Amazon Pay
      else if (payment_method.amazonpay) {
        method = "Amazon Pay";
      }
      // Paypal
      else if (payment_method.paypal) {
        method = "PayPal";
      }
      // Cashfree Token
      else if (payment_method.token) {
        method = "Saved Card/Token";
      }
      // NEFT/RTGS/IMPS
      else if (payment_method.banktransfer) {
        method = `Bank Transfer (${payment_method.banktransfer.channel || ''})`;
      }
      // Default case for any other method
      else {
        method = payment_method.channel || payment_method.provider || "Cashfree Payment";
      }
    }

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

    await newOrder.save();
    await Cart.deleteMany({ userEmail: { $regex: new RegExp(`^${raw.formFields.email}$`, "i") } });
    res.status(200).send("Order saved via webhook");
  } catch (err) {
    console.error("🔥 Webhook Save Failed:", err);
    res.status(500).send("error ignored");
  }
});

module.exports = router;
