import { useEffect, useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

const css = `
  @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes checkDraw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes confettiFall {
    0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(500px) rotate(720deg); opacity: 0; }
  }
  .os-check-path { stroke-dasharray: 100; stroke-dashoffset: 100; animation: checkDraw 0.6s 0.4s ease forwards; }
  .os-confetti { position: absolute; animation: confettiFall linear forwards; pointer-events: none; }

  .os-page {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .os-icon {
    width: 88px;
    height: 88px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.5rem;
    animation: scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .os-title {
    font-size: 26px;
    font-weight: 500;
    margin: 0 0 0.5rem;
    color: #111;
    animation: fadeUp 0.5s 0.6s ease both;
  }
  .os-subtitle {
    font-size: 15px;
    color: #666;
    max-width: 380px;
    line-height: 1.7;
    margin: 0 0 2rem;
    animation: fadeUp 0.5s 0.8s ease both;
  }
  .os-card {
    background: #f9f9f9;
    border: 0.5px solid #e8e8e8;
    border-radius: 14px;
    padding: 1.25rem 1.75rem;
    margin-bottom: 1.75rem;
    width: 100%;
    max-width: 380px;
    text-align: left;
    animation: fadeUp 0.5s 1.0s ease both;
  }
  .os-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .os-row:last-child { border-bottom: none; }
  .os-label { font-size: 13px; color: #888; }
  .os-value { font-size: 13px; font-weight: 600; color: #111; }
  .os-badge {
    font-size: 12px;
    padding: 3px 12px;
    border-radius: 99px;
    background: #d1fae5;
    color: #065f46;
    font-weight: 600;
  }
  .os-btn-row {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
    animation: fadeUp 0.5s 1.2s ease both;
  }
  .os-btn-primary {
    padding: 11px 26px;
    font-size: 14px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
  }
  .os-btn-secondary {
    padding: 11px 26px;
    font-size: 14px;
    background: transparent;
    color: #111;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
  }
  .os-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #eee;
    border-top: 4px solid #111;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 1.5rem;
  }
  .os-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #bbb;
  }
  .os-icon-error { background: #fee2e2; }
  .os-icon-pending { background: #fef3c7; }
  .os-icon-success { background: #d1fae5; }
`;

const CONFETTI_COLORS = ["#22c55e","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316"];

const OrderStatus = () => {
  const { user, setCartItems } = useContext(MyContext);
  const hasSavedRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [orderRef, setOrderRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const paymentResult = params.get("paid") || params.get("order_status");

  useEffect(() => {
    if (!token || (
      paymentResult !== "true" &&
      paymentResult !== "SUCCESS" &&
      paymentResult !== "PAID"
    )) {
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

          setPaymentMethod("Online");
          setStatus("success");

          localStorage.removeItem(`order_${token}`);
          localStorage.removeItem(`cf_order_${token}`);
          setCartItems([]);
        } else {
          setPaymentMethod("Online");
          setStatus("success");
        }
      } catch (err) {
        console.error("Order processing failed:", err.message);
        setStatus("error");
        setError("Something went wrong while confirming your order.");
      }
    };

    saveAndProcessOrder();
  }, [token, user, navigate, paymentResult]);

  if (status === "loading") {
    return (
      <>
        <style>{css}</style>
        <div className="os-page">
          <div className="os-spinner" />
          <h2 className="os-title" style={{ animation: "none" }}>Processing your order...</h2>
          <p className="os-subtitle" style={{ animation: "none" }}>
            We're confirming your payment. Please don't close this tab.
          </p>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="os-dot"
                style={{ animation: `pulse 1.2s ${i * 0.2}s ease-in-out infinite` }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <style>{css}</style>
        <div className="os-page">
          <div className="os-icon os-icon-error">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M14 14 L26 26 M26 14 L14 26" stroke="#dc2626" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="os-title">Something went wrong</h2>
          <p className="os-subtitle">{error || "We couldn't confirm your order. Please contact support."}</p>
          <div className="os-btn-row">
            <button className="os-btn-primary" onClick={() => navigate("/")}>Contact support</button>
            <button className="os-btn-secondary" onClick={() => navigate("/")}>Go home</button>
          </div>
        </div>
      </>
    );
  }

  if (status === "pending") {
    return (
      <>
        <style>{css}</style>
        <div className="os-page">
          <div className="os-icon os-icon-pending">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
              <circle cx="19" cy="19" r="2.5" fill="#d97706" />
              <path d="M19 10 L19 17" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="os-title">Payment processing</h2>
          <p className="os-subtitle">
            Your payment is still being verified. Check your orders page in a few minutes or look for a confirmation email.
          </p>
          <div className="os-btn-row">
            <button className="os-btn-primary" onClick={() => navigate("/orders")}>Check order status</button>
            <button className="os-btn-secondary" onClick={() => navigate("/")}>Continue shopping</button>
          </div>
        </div>
      </>
    );
  }

  // SUCCESS
  return (
    <>
      <style>{css}</style>
      <div className="os-page">
        {/* Confetti */}
        {CONFETTI_COLORS.map((color, i) =>
          [0, 1, 2, 3].map((j) => (
            <div
              key={`${i}-${j}`}
              className="os-confetti"
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
        <div className="os-icon os-icon-success">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <path
              className="os-check-path"
              d="M10 22 L18 30 L34 14"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="os-title">Order confirmed!</h2>
        <p className="os-subtitle">
          Thank you for your purchase. Your order is now being processed and you'll receive an update soon.
        </p>

        <div className="os-card">
          <div className="os-row">
            <span className="os-label">Order reference</span>
            <span className="os-value" style={{ fontFamily: "monospace" }}>#{orderRef}</span>
          </div>
          <div className="os-row">
            <span className="os-label">Status</span>
            <span className="os-badge">Confirmed</span>
          </div>
          <div className="os-row">
            <span className="os-label">Payment</span>
            <span className="os-value">{paymentMethod} · ₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="os-btn-row">
          <button className="os-btn-primary" onClick={() => navigate("/orders")}>View my orders</button>
          <button className="os-btn-secondary" onClick={() => navigate("/")}>Continue shopping</button>
        </div>
      </div>
    </>
  );
};

export default OrderStatus;