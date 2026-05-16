import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";

// ─── STATUS CONFIG ────────────────────────────────────────────────
const STATUS_MAP = {
  pending:    { label: "Pending",    bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  processing: { label: "Processing", bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
  shipped:    { label: "Shipped",    bg: "#EDE9FE", color: "#5B21B6", dot: "#8B5CF6" },
  completed:  { label: "Completed",  bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  cancelled:  { label: "Cancelled",  bg: "#FEE2E2", color: "#991B1B", dot: "#EF4444" },
};
const getStatus = (s = "") => STATUS_MAP[s.toLowerCase()] || STATUS_MAP["pending"];

// ─── KEYFRAMES ────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .ord-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .ord-root { font-family: 'Sora', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-10px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .ord-card {
    background: #fff;
    border: 1px solid #EBEBEB;
    border-radius: 16px;
    padding: 20px 22px;
    cursor: pointer;
    transition: box-shadow 0.2s, border-color 0.2s, transform 0.15s;
    animation: fadeUp 0.35s ease both;
  }
  .ord-card:hover {
    box-shadow: 0 8px 28px rgba(0,0,0,0.08);
    border-color: #D0D0D0;
    transform: translateY(-2px);
  }
  .ord-card:active { transform: scale(0.99); }

  .ord-thumb {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #F0F0F0;
    background: #F7F6F3;
    flex-shrink: 0;
  }
  .ord-thumb-more {
    width: 52px;
    height: 52px;
    border-radius: 10px;
    background: #F0EFF0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #888;
    font-weight: 500;
    flex-shrink: 0;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 500;
  }
  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .detail-section {
    background: #fff;
    border: 1px solid #EBEBEB;
    border-radius: 16px;
    padding: 22px 24px;
    animation: slideIn 0.3s ease both;
  }
  .detail-section + .detail-section { margin-top: 14px; }

  .section-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9CA3AF;
    margin-bottom: 16px;
  }

  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 9px 0;
    border-bottom: 1px solid #F3F3F3;
    font-size: 14px;
    gap: 12px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-key { color: #9CA3AF; white-space: nowrap; flex-shrink: 0; }
  .info-val { color: #111; font-weight: 500; text-align: right; word-break: break-word; }

  .prod-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid #F3F3F3;
    animation: fadeUp 0.3s ease both;
  }
  .prod-row:last-child { border-bottom: none; }
  .prod-img {
    width: 58px;
    height: 58px;
    border-radius: 10px;
    object-fit: cover;
    border: 1px solid #F0F0F0;
    flex-shrink: 0;
    background: #F7F6F3;
  }

  .mono { font-family: 'JetBrains Mono', monospace; font-size: 12px; }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid #E5E5E5;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 13px;
    font-family: 'Sora', sans-serif;
    cursor: pointer;
    color: #444;
    transition: background 0.15s, border-color 0.15s;
    margin-bottom: 24px;
  }
  .back-btn:hover { background: #F7F6F3; border-color: #CACACA; }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 0 0;
    font-size: 15px;
    font-weight: 600;
    color: #111;
  }

  .empty-state {
    text-align: center;
    padding: 80px 24px;
    animation: fadeUp 0.4s ease both;
  }
  .empty-icon {
    width: 64px;
    height: 64px;
    background: #F0EFF0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
  }
  .shop-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #111;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 14px;
    font-family: 'Sora', sans-serif;
    font-weight: 500;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.15s, transform 0.1s;
  }
  .shop-btn:hover { background: #333; }
  .shop-btn:active { transform: scale(0.98); }

  .page-title {
    font-size: 22px;
    font-weight: 600;
    color: #111;
    margin-bottom: 6px;
  }
  .page-sub {
    font-size: 13px;
    color: #9CA3AF;
    margin-bottom: 24px;
  }

  .order-id-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #F7F6F3;
    border: 1px solid #E8E8E8;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 12px;
    color: #555;
  }
`;

// ─── HELPERS ─────────────────────────────────────────────────────
const fmt = (n) => {
  const num = parseFloat(n);
  return isNaN(num) ? "₹0.00" : `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── ORDER LIST CARD ─────────────────────────────────────────────
const OrderCard = ({ order, onClick, delay }) => {
  const st = getStatus(order.orderStatus);
  const previews = (order.products || []).slice(0, 3);
  const extra = (order.products || []).length - 3;
  return (
    <div className="ord-card" onClick={onClick} style={{ animationDelay: `${delay}ms` }}>
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 4 }}>
            {fmtDate(order.date || order.createdAt)}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
              #{order._id?.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>
        <span className="status-pill" style={{ background: st.bg, color: st.color }}>
          <span className="status-dot" style={{ background: st.dot }} />
          {st.label}
        </span>
      </div>

      {/* Product thumbnails */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, alignItems: "center" }}>
        {previews.map((p, i) => (
          <img key={i} src={p.image} alt={p.name} className="ord-thumb"
            onError={(e) => { e.target.style.display = "none"; }} />
        ))}
        {extra > 0 && <div className="ord-thumb-more">+{extra}</div>}
      </div>

      {/* Bottom row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "#9CA3AF" }}>
          {(order.products || []).length} item{(order.products || []).length !== 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>
            {fmt(order.totalAmount)}
          </span>
          <span style={{ fontSize: 18, color: "#CCC" }}>›</span>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER DETAIL VIEW ───────────────────────────────────────────
const OrderDetail = ({ order, onBack }) => {
  const st = getStatus(order.orderStatus);
  const products = order.products || [];
  const subtotal = products.reduce((acc, p) => acc + parseFloat(p.price || 0) * (p.quantity || 1), 0);

  return (
    <div>
      <button className="back-btn" onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7L9 12" stroke="#444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to orders
      </button>

      {/* Order Header */}
      <div className="detail-section" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 6 }}>
              Order #{order._id?.slice(-8).toUpperCase()}
            </div>
            <div style={{ fontSize: 13, color: "#9CA3AF" }}>
              Placed on {fmtDate(order.date || order.createdAt)}
            </div>
          </div>
          <span className="status-pill" style={{ background: st.bg, color: st.color, fontSize: 13, padding: "6px 14px" }}>
            <span className="status-dot" style={{ background: st.dot }} />
            {st.label}
          </span>
        </div>

        {/* IDs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
          {order.orderId && (
            <div className="order-id-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="1" width="10" height="10" rx="2" stroke="#888" strokeWidth="1.2"/>
                <path d="M3.5 6h5M3.5 4h5M3.5 8h3" stroke="#888" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span className="mono">{order.orderId}</span>
            </div>
          )}
          {order.paymentId && (
            <div className="order-id-badge">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2.5" width="10" height="7" rx="1.5" stroke="#888" strokeWidth="1.2"/>
                <path d="M1 5h10" stroke="#888" strokeWidth="1.2"/>
                <circle cx="3.5" cy="7.5" r="0.8" fill="#888"/>
              </svg>
              <span className="mono">{order.paymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="detail-section">
        <div className="section-label">Items ordered</div>
        {products.map((p, i) => (
          <div key={i} className="prod-row" style={{ animationDelay: `${i * 60}ms` }}>
            <img src={p.image} alt={p.name} className="prod-img"
              onError={(e) => { e.target.src = "https://via.placeholder.com/58x58?text=?"; }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: "#111", marginBottom: 3,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                Qty: {p.quantity}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
                {fmt(parseFloat(p.price) * p.quantity)}
              </div>
              <div style={{ fontSize: 12, color: "#B0B0B0" }}>
                {fmt(p.price)} each
              </div>
            </div>
          </div>
        ))}

        {/* Totals */}
        <div style={{ borderTop: "1px solid #F3F3F3", marginTop: 4, paddingTop: 4 }}>
          <div className="info-row">
            <span className="info-key">Subtotal</span>
            <span className="info-val">{fmt(subtotal)}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Shipping</span>
            <span className="info-val" style={{ color: "#10B981" }}>Free</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <span>{fmt(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Two col: Shipping + Payment */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginTop: 14 }}>

        {/* Shipping */}
        <div className="detail-section">
          <div className="section-label">Shipping information</div>
          <div className="info-row">
            <span className="info-key">Name</span>
            <span className="info-val">{order.name || "—"}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Phone</span>
            <span className="info-val">{order.phone || "—"}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Email</span>
            <span className="info-val" style={{ fontSize: 13 }}>{order.email || "—"}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Address</span>
            <span className="info-val" style={{ fontSize: 13 }}>
              {[order.address, order.city, order.state, order.zipCode, order.country]
                .filter(Boolean).join(", ") || "—"}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="detail-section">
          <div className="section-label">Payment information</div>
          <div className="info-row">
            <span className="info-key">Method</span>
            <span className="info-val">{order.paymentMethod || "Online"}</span>
          </div>
          <div className="info-row">
            <span className="info-key">Status</span>
            <span className="info-val">
              <span style={{ background: "#D1FAE5", color: "#065F46", padding: "2px 10px",
                borderRadius: 99, fontSize: 12, fontWeight: 500 }}>Paid</span>
            </span>
          </div>
          {order.paymentId && (
            <div className="info-row">
              <span className="info-key">Payment ID</span>
              <span className="info-val mono" style={{ fontSize: 11 }}>{order.paymentId}</span>
            </div>
          )}
          {order.orderId && (
            <div className="info-row">
              <span className="info-key">Order ID</span>
              <span className="info-val mono" style={{ fontSize: 11 }}>{order.orderId}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-key">Amount paid</span>
            <span className="info-val" style={{ fontSize: 15 }}>{fmt(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EMPTY STATE ─────────────────────────────────────────────────
const EmptyState = ({ onShop }) => (
  <div className="empty-state">
    <div className="empty-icon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M5 7h18l-2 12H7L5 7Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="10" cy="23" r="1.5" fill="#9CA3AF"/>
        <circle cx="18" cy="23" r="1.5" fill="#9CA3AF"/>
        <path d="M2 3h2.5l.5 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
    <div style={{ fontSize: 17, fontWeight: 600, color: "#111", marginBottom: 8 }}>No orders yet</div>
    <div style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 280, margin: "0 auto" }}>
      You haven't placed any orders yet. Start browsing and find something you'll love.
    </div>
    <button className="shop-btn" onClick={onShop}>
      Browse products
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5 3l4 4-4 4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  </div>
);

const Skeleton = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {[1, 2, 3].map(i => (
      <div key={i} style={{ background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16,
        padding: "20px 22px", animation: "fadeUp 0.3s ease both", animationDelay: `${i * 80}ms` }}>
        <div style={{ height: 12, width: "40%", background: "#F0F0F0", borderRadius: 6, marginBottom: 10 }} />
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[1, 2, 3].map(j => (
            <div key={j} style={{ width: 52, height: 52, background: "#F5F5F5", borderRadius: 10 }} />
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ height: 12, width: "20%", background: "#F0F0F0", borderRadius: 6 }} />
          <div style={{ height: 14, width: "18%", background: "#EBEBEB", borderRadius: 6 }} />
        </div>
      </div>
    ))}
  </div>
);

const OrdersPage = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const { user }                = useContext(MyContext);
  const navigate                = useNavigate();

  useEffect(() => {
    if (!user?.email) return;
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user.email}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders:", err.message))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="ord-root">
      <style>{css}</style>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 60px" }}>

        {selected ? (
          <OrderDetail order={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div className="page-title">My Orders</div>
            <div className="page-sub">
              {loading ? "Loading your orders…"
                : orders.length > 0
                  ? `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`
                  : "You haven't ordered anything yet"}
            </div>

            {loading ? <Skeleton /> : orders.length === 0 ? (
              <EmptyState onShop={() => navigate("/")} />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {orders.map((order, i) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    delay={i * 60}
                    onClick={() => setSelected(order)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;