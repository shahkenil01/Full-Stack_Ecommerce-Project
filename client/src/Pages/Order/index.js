import React, { useState, useEffect, useContext } from 'react';
import OrdersProductDialog from '../../Components/OrderProductModel';
import { MyContext } from '../../App';
import axios from 'axios';

const OrdersTable = () => {
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { user } = useContext(MyContext);

  
  const handleOpenDialog = (products) => { setSelectedProducts(products); setOpen(true); };
  const handleCloseDialog = () => setOpen(false);

  useEffect(() => {
    if (!user?._id) return;

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user._id}`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch orders:", err.message);
      });
  }, [user]);

  return (
    <section className="section">
      <div className="container">
        <h2 className="hd">Orders</h2>
        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-light">
              <tr>
                <th>Order Id</th>
                <th>Payment Id</th>
                <th>Products</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Pincode</th>
                <th>Total Amount</th>
                <th>Email</th>
                <th>User Id</th>
                <th>Order Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="12">No orders found</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td><span className="text-blue font-weight-bold">{order.orderId}</span></td>
                    <td><span className="text-blue font-weight-bold">{order.paymentId}</span></td>
                    <td>
                      <span
                        className="text-blue font-weight-bold cursor"
                        onClick={() => handleOpenDialog(order.products)}
                        style={{ cursor: 'pointer' }}
                      >
                        View Products
                      </span>
                    </td>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>{order.address}</td>
                    <td>{order.pincode}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.email}</td>
                    <td>{order.userId}</td>
                    <td>
                      <span className="badge badge-danger">{order.orderStatus}</span>
                    </td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrdersProductDialog open={open} handleClose={handleCloseDialog} products={selectedProducts}/>
    </section>
  );
};

export default OrdersTable;
