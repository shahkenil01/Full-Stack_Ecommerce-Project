import { useEffect, useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

const OrderStatus = () => {
  const { user, setCartItems } = useContext(MyContext);
  const hasSavedRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | pending | error
  const [error, setError] = useState(null);
  const [orderRef, setOrderRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const paymentResult = params.get("paid");

  useEffect(() => {
    if (!token || paymentResult !== "true") {
      navigate("/orders");
      return;
    }

    const saveAndProcessOrder = async () => {
      if (!token || !user?._id || hasSavedRef.current) return;
      hasSavedRef.current = true;

      try {
        const raw = localStorage.getItem(`order_${token}`);
        if (raw) {
          const stored = JSON.parse(raw);
          const cart = stored?.cartItems || [];
          const formFields = stored?.formFields || {};
          const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
          setTotalAmount(total);
          setOrderRef(token.slice(3, 9).toUpperCase());

          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/save-temp`, {
            token,
            cartItems: cart,
            formFields,
          });

          await new Promise((r) => setTimeout(r, 3000));

          let attempts = 0;
          while (attempts < 10) {
            const res = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user.email}`
            );
            if (Array.isArray(res.data) && res.data.length > 0) {
              const latest = res.data[0];
              setPaymentMethod(latest.paymentMethod || "Online");
              setStatus("success");
              break;
            }
            await new Promise((r) => setTimeout(r, 1500));
            attempts++;
          }

          if (attempts === 10) {
            setStatus("pending");
            setError("Payment confirmation is taking longer than expected. Your order may still process.");
          }

          localStorage.removeItem(`order_${token}`);
          localStorage.removeItem(`cf_order_${token}`);
          setCartItems([]);
        }
      } catch (err) {
        console.error("Order processing failed:", err.message);
        setStatus("error");
        setError("Something went wrong while confirming your order.");
      }
    };

    saveAndProcessOrder();
  }, [token, user, navigate, paymentResult]);

  const styles = {
    page: {
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "3rem 1rem",
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    },
    iconWrap: {
      width: 88,
      height: 88,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1.5rem",
      animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
    },
    title: {
      fontSize: 28,
      fontWeight: 600,
      margin: "0 0 0.5rem",
      color: "#111",
      animation: "fadeUp 0.5s 0.6s ease both",
    },
    subtitle: {
      fontSize: 15,
      color: "#666",
      maxWidth: 380,
      lineHeight: 1.7,
      margin: "0 0 2rem",
      animation: "fadeUp 0.5s 0.8s ease both",
    },
    card: {
      background: "#f9f9f9",
      border: "1px solid #e8e8e8",
      borderRadius: 14,
      padding: "1.25rem 1.75rem",
      marginBottom: "1.75rem",
      width: "100%",
      maxWidth: 380,
      textAlign: "left",
      animation: "fadeUp 0.5s 1.0s ease both",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 0",
      borderBottom: "1px solid #f0f0f0",
    },
    label: { fontSize: 13, color: "#888" },
    value: { fontSize: 13, fontWeight: 600, color: "#111" },
    badge: {
      fontSize: 12,
      padding: "3px 12px",
      borderRadius: 99,
      background: "#d1fae5",
      color: "#065f46",
      fontWeight: 600,
    },
    btnRow: {
      display: "flex",
      gap: 12,
      flexWrap: "wrap",
      justifyContent: "center",
      animation: "fadeUp 0.5s 1.2s ease both",
    },
    btnPrimary: {
      padding: "11px 26px",
      fontSize: 14,
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 500,
    },
    btnSecondary: {
      padding: "11px 26px",
      fontSize: 14,
      background: "transparent",
      color: "#111",
      border: "1.5px solid #ddd",
      borderRadius: 8,
      cursor: "pointer",
    },
  };

  const keyframes = `
    @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes checkDraw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
    @keyframes confettiFall {
      0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
      100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
    }
    .check-path { stroke-dasharray: 100; stroke-dashoffset: 100; animation: checkDraw 0.6s 0.4s ease forwards; }
  `;

  if (status === "loading") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.page}>
          <div style={{ width: 60, height: 60, border: "4px solid #eee", borderTop: "4px solid #111", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: "1.5rem" }} />
          <h2 style={{ ...styles.title, animation: "none" }}>Processing your order...</h2>
          <p style={{ ...styles.subtitle, animation: "none" }}>
            We're confirming your payment. Please don't close this tab.
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#bbb", animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }} />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.page}>
          <div style={{ ...styles.iconWrap, background: "#fee2e2" }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M14 14 L26 26 M26 14 L14 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={styles.title}>Something went wrong</h2>
          <p style={styles.subtitle}>{error || "We couldn't confirm your order. Please contact support."}</p>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => navigate("/")}>Contact support</button>
            <button style={styles.btnSecondary} onClick={() => navigate("/")}>Go home</button>
          </div>
        </div>
      </>
    );
  }

  if (status === "pending") {
    return (
      <>
        <style>{keyframes}</style>
        <div style={styles.page}>
          <div style={{ ...styles.iconWrap, background: "#fef3c7" }}>
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="2.5" fill="#d97706" />
              <path d="M19 10 L19 17" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={styles.title}>Payment processing</h2>
          <p style={styles.subtitle}>
            Your payment is still being verified. Check your orders page in a few minutes or look for a confirmation email.
          </p>
          <div style={styles.btnRow}>
            <button style={styles.btnPrimary} onClick={() => navigate("/orders")}>Check order status</button>
            <button style={styles.btnSecondary} onClick={() => navigate("/")}>Continue shopping</button>
          </div>
        </div>
      </>
    );
  }

  // SUCCESS
  return (
    <>
      <style>{`
        ${keyframes}
        .confetti-piece { position: absolute; animation: confettiFall linear forwards; pointer-events: none; }
      `}</style>

      <div style={styles.page}>
        {/* Confetti */}
        {["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316"].map((color, i) =>
          [0,1,2,3].map((j) => (
            <div
              key={`${i}-${j}`}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                top: -10,
                width: `${6 + Math.random() * 7}px`,
                height: `${6 + Math.random() * 7}px`,
                background: color,
                borderRadius: j % 2 === 0 ? "50%" : "2px",
                animationDuration: `${1.4 + Math.random() * 2}s`,
                animationDelay: `${Math.random() * 0.8}s`,
              }}
            />
          ))
        )}

        {/* Check icon */}
        <div style={{ ...styles.iconWrap, background: "#d1fae5", animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path className="check-path" d="M10 22 L18 30 L34 14" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={styles.title}>Order confirmed!</h2>
        <p style={styles.subtitle}>
          Thank you for your purchase. Your order is now being processed and you'll receive an update soon.
        </p>

        <div style={styles.card}>
          <div style={styles.row}>
            <span style={styles.label}>Order reference</span>
            <span style={{ ...styles.value, fontFamily: "monospace" }}>#{orderRef}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Status</span>
            <span style={styles.badge}>Confirmed</span>
          </div>
          <div style={{ ...styles.row, borderBottom: "none" }}>
            <span style={styles.label}>Payment</span>
            <span style={styles.value}>{paymentMethod} · ₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div style={styles.btnRow}>
          <button style={styles.btnPrimary} onClick={() => navigate("/orders")}>View my orders</button>
          <button style={styles.btnSecondary} onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      </div>
    </>
  );
};

export default OrderStatus;