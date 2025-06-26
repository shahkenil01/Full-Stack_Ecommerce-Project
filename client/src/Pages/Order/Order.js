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

        // ✅ Also save this data to backend-readable folder
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
    }, 500); // poll interval
    return () => clearInterval(interval);
  }, 3000); // ✅ 3 second delay before polling starts

  return () => clearTimeout(timer);
}, [user]);

  if (loading) return <div style={{ padding: "2rem", textAlign: "center" }}>⏳ Waiting for payment confirmation...</div>;

  return <OrdersTable />;
};

export default Orders;
