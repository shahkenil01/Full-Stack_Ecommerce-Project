import React, { useState, useEffect, useContext } from "react";
import { MyContext } from "../../App";
import axios from "axios";
import { Card, CardHeader, CardContent, Typography, Divider, Chip, Avatar, Button,
} from "@mui/material";
import { MdInfo } from "react-icons/md";

const truncate = (str = "", len = 20) => {
  return str.length > len ? str.slice(0, len) + "..." : str;
};

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useContext(MyContext);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user.email}`)
      .then((res) => setOrders(res.data))
      .catch((err) =>
        console.error("❌ Failed to fetch orders:", err.message)
      );
  }, [user]);

  if (orders.length === 0) {
    return (
      <section className="section">
        <div className="container text-center">
          <h2 className="hd">Orders</h2>
          <p>No orders found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd">Orders</h2>
        {orders.map((order) => (
          <Card key={order._id} className="mb-4 shadow-sm">
            <CardHeader
              title={`Order on ${new Date(order.date).toLocaleDateString()}`}
              subheader={`Payment Mode: ${order.paymentMethod || "N/A"}`}
              action={
                <Chip
                  label={order.orderStatus}
                  color="error"
                  variant="filled"
                  size="small"
                />
              }
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Products
              </Typography>
              <Divider className="mb-2" />
              {order.products.map((prod, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center mb-3"
                  style={{ gap: "15px" }}
                >
                  <Avatar
                    src={prod.image}
                    alt={prod.name}
                    variant="rounded"
                    sx={{ width: 56, height: 56 }}
                  />
                  <div>
                    <div>
                      <strong>{truncate(prod.name, 20)}</strong>
                    </div>
                    <small>
                      Qty: {prod.quantity} | ₹{prod.price} × {prod.quantity} = ₹
                      {prod.subtotal}
                    </small>
                  </div>
                </div>
              ))}

              <Divider className="mt-3 mb-2" />
              <Typography variant="h6">User Info</Typography>
              <div className="pl-1 mt-1">
                <div><strong>Name:</strong> {order.name}</div>
                <div><strong>Email:</strong> {order.email}</div>
                <div><strong>Phone:</strong> {order.phone}</div>
                <div><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.country}, {order.zipCode}</div>
              </div>

              <Divider className="mt-3 mb-2" />
              <div className="d-flex justify-content-between align-items-center">
                <Typography><strong>Total:</strong> ₹{order.totalAmount}</Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  startIcon={<MdInfo />}
                >
                  {order.paymentId}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default OrdersTable;
