import { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import OrdersTable from "./index";

const Orders = () => {
  const { user, setCartItems } = useContext(MyContext);
  const hasSavedRef = useRef(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  let cart = [];
  let formFields = {};
  let shouldSave = false;

  if (token) {
    try {
      const raw = localStorage.getItem(`order_${token}`);
      if (raw) {
        const stored = JSON.parse(raw);
        cart = stored?.cartItems || [];
        formFields = stored?.formFields || {};
        shouldSave = params.get("paid") === "true";
      }
    } catch (e) {
      console.error("❌ Failed to decode order data:", e);
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {

      if (!shouldSave) {
        setLoading(false);
        return clearInterval(interval);
      }

      if (
        hasSavedRef.current ||
        !user?._id ||
        cart.length === 0 ||
        !formFields.email
      ) {
        return;
      }

      hasSavedRef.current = true;
      clearInterval(interval);

      const formattedProducts = cart.map((item) => ({
        productId: item._id || item.productId,
        name: item.name || item.productTitle,
        image: item.images?.[0] || item.image,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      }));

      const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

      const payload = {
        orderId: "order_" + Date.now(),
        paymentId: "pay_" + Date.now(),
        products: formattedProducts,
        name: formFields.fullName,
        addressLine1: formFields.streetAddressLine1,
        addressLine2: formFields.streetAddressLine2,
        phone: formFields.phoneNumber,
        zipCode: formFields.zipCode,
        totalAmount,
        email: formFields.email,
        userId: user._id,
      };

      try {
        console.log("📦 Sending order to backend:", payload);
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/orders/create`, payload);
        // 🧹 Clean Razorpay & temp order keys
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("order_ot_") || key.startsWith("rzp_")) {
            localStorage.removeItem(key);
          }
        });

        // ✅ Save minimal order details
        localStorage.setItem("order_last", JSON.stringify({
          orderId: payload.orderId,
          paymentId: payload.paymentId
        }));

        setCartItems([]);
        localStorage.removeItem(`order_${token}`);

        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/user/clear-cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        });
      } catch (err) {
        console.error("Order save failed:", err.response?.data || err.message);
      }

      setLoading(false);
    }, 400);

    return () => clearInterval(interval);
  }, [user]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>⏳ Saving your order...</div>;

  return <OrdersTable />;
};

export default Orders;
