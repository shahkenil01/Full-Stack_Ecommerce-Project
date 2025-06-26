import { useEffect, useContext, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import OrdersTable from "./index";

const Orders = () => {
  const { user, setCartItems } = useContext(MyContext);
  const hasSavedRef = useRef(false);
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const paid = params.get("paid") === "true";
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
        shouldSave = paid;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/save-temp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, cartItems: cart, formFields }),
        });
      }
    } catch (e) {
      console.error("❌ Failed to decode order data:", e);
    }
  }
  const [loading, setLoading] = useState(shouldSave);

  useEffect(() => {
  const timer = setTimeout(() => {
    const interval = setInterval(async () => {
      if (!shouldSave || !user?._id) {
        setLoading(false);
        return clearInterval(interval);
      }

      if (hasSavedRef.current) return;
      hasSavedRef.current = true;

      let attempts = 0;
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      while (attempts < 10) {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${userInfo?.email}`
          );
          if (Array.isArray(res.data) && res.data.length > 0) {
            break;
          }
        } catch (e) {
          console.warn("📛 Polling failed:", e.message);
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));
        attempts++;
      }

      localStorage.removeItem(`order_${token}`);
      localStorage.removeItem(`cf_order_${token}`);
      setCartItems([]);
      setLoading(false);
    }, 500);
    return () => clearInterval(interval);
  }, 3000);

  return () => clearTimeout(timer);
}, [user]);

  if (loading)
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f9f9f9", flexDirection: "column", textAlign: "center", }}>
      <div style={{ fontSize: "3rem", animation: "pulse 1.5s infinite" }}>
        🧾
      </div>
      <h2 style={{ margin: "1rem 0 0.5rem" }}>Processing Your Order</h2>
      <p style={{ color: "#555" }}>
        Please wait while we confirm your payment and finalize your order.
      </p>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );

  return <OrdersTable />;
};

export default Orders;
