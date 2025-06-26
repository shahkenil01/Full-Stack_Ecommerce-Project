const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const Order = require("../models/order");
const Cart = require("../models/Cart");
const TempOrder = require("../models/tempOrder");

// Helper delay function
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Retry logic to find temp order
async function findTempOrderWithRetry(token, retries = 8, delayMs = 1000) {
  for (let i = 1; i <= retries; i++) {
    const found = await TempOrder.findOne({ token });
    if (found) {
      console.log(`✅ Found temp order on attempt #${i}`);
      return found;
    }
    
    console.log(`⏳ Temp order not found (attempt ${i}/${retries}), retrying in ${delayMs}ms...`);
    await wait(delayMs);
  }
  return null;
}

function verifyWebhookSignature(postData, signature, secretKey) {
  const generatedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(postData)
    .digest('base64');
  
  return generatedSignature === signature;
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
router.post('/webhook', async (req, res) => {
  console.log('ℹ️ Webhook received (TEST MODE)');
  console.log('Headers:', req.headers);
  console.log('Raw Body:', JSON.stringify(req.body, null, 2));

  try {
    const { type, data } = req.body;

    // 1. Check if this is a payment success event
    if (type !== 'PAYMENT_SUCCESS_WEBHOOK') {
      console.log('⚠️ Ignoring non-payment event:', type);
      return res.status(200).json({ status: 'ignored', reason: 'Not a payment event' });
    }

    // 2. Extract required data
    const { order, payment } = data;
    const token = order?.order_tags?.token;
    const paymentId = payment?.cf_payment_id;
    const orderId = order?.order_id;

    if (!token || !paymentId || !orderId) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { token, paymentId, orderId }
      });
    }

    // 3. Find temporary order (simulating DB lookup)
    console.log(`🔍 Looking for temp order with token: ${token}`);
    const tempOrder = await findTempOrderWithRetry(token, 8, 1000);

    if (!tempOrder) {
      console.error('❌ Temp order not found');
      return res.status(400).json({ 
        error: 'Order not found',
        token
      });
    }

    // 4. Format products for new order
    const formattedProducts = tempOrder.cartItems.map(item => ({
      productId: item._id || item.productId,
      name: item.name || item.productTitle,
      image: item.images?.[0] || item.image,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));

    // 5. Create new order
    const newOrder = new Order({
      paymentId,
      orderId,
      paymentMethod: getPaymentMethod(payment.payment_method),
      products: formattedProducts,
      name: tempOrder.formFields?.fullName || 'Guest',
      phone: tempOrder.formFields?.phoneNumber || '0000000000',
      email: tempOrder.formFields?.email || 'noemail@example.com',
      address: [
        tempOrder.formFields?.streetAddressLine1,
        tempOrder.formFields?.streetAddressLine2
      ].filter(Boolean).join(', '),
      city: tempOrder.formFields?.city || '',
      state: tempOrder.formFields?.state || '',
      zipCode: tempOrder.formFields?.zipCode || '',
      country: tempOrder.formFields?.country || '',
      totalAmount: payment.payment_amount || order.order_amount || 0,
      orderStatus: 'processing'
    });

    // 6. Save order and clean up
    await newOrder.save();
    await TempOrder.deleteOne({ token });
    await Cart.deleteMany({ userEmail: tempOrder.formFields?.email });

    console.log(`✅ Order created: ${newOrder._id}`);
    return res.status(200).json({ 
      success: true,
      orderId: newOrder._id,
      paymentId
    });

  } catch (error) {
    console.error('🔥 Webhook processing failed:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Helper function to determine payment method
function getPaymentMethod(paymentMethod) {
  if (!paymentMethod) return 'Unknown';
  
  if (paymentMethod.card) return 'Credit/Debit Card';
  if (paymentMethod.upi) return 'UPI';
  if (paymentMethod.netbanking) return 'Net Banking';
  if (paymentMethod.wallet) return 'Mobile Wallet';
  
  return 'Cashfree Payment';
}

module.exports = router;
