import { useState, useEffect, useContext } from "react";
import { Button, Dialog, Breadcrumbs, Typography, Link as MuiLink, TablePagination } from "@mui/material";
import { MdClose, MdDelete } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { useSnackbar } from "notistack";
import { fetchDataFromApi } from "../../utils/api";
import { MyContext } from "../../App";
import CustomDropdown from "../../components/CustomDropdown";

const Orders = () => {
  const context = useContext(MyContext);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem("userToken");

  const showProducts = (id) => {
    const foundOrder = orders.find((order) => order._id === id);
    if (foundOrder) {
      setProducts(foundOrder.products);
      setIsOpenModal(true);
    }
  };
  useEffect(() => {
    fetchDataFromApi(`/api/orders/all`).then((data) => {
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        setOrders(sorted);
      }
    });
  }, []);

  const handleStatusChange = async (value, orderId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: value })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.msg || "Failed to update status");
      }

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: value } : order
        )
      );

      enqueueSnackbar("Order status updated successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      console.error("❌ Error updating status:", err.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.msg || "Failed to delete order");
      }

      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      enqueueSnackbar("Order deleted successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      console.error("❌ Error deleting order:", err.message);
    }
  };

  return (
    <div className="right-content w-100">
      {/* Breadcrumb */}
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Orders List</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink underline="hover" color="inherit" href="/" className="breadcrumb-link">
              <IoMdHome /> Dashboard
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Orders
            </Typography>
          </Breadcrumbs>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card shadow border-0 p-3 mt-4">
        <h3 className="hd">All Orders</h3>

        <div className="table-responsive order fixedheight mt-3">
          <table className={`table table-bordered v-align ${context.isToggleSidebar ? 'fullWidthTable' : ''}`}>
            <thead className="thead-dark">
              <tr>
                <th>Order ID</th>
                <th>Payment ID</th>
                <th>Name</th>
                <th>Products</th>
                <th>User Info</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order._id}</td>
                  <td>{order.paymentId}</td>
                  <td>{order.name}</td>
                  <td>
                    <span className="text-blue cursor" onClick={() => showProducts(order._id)}>
                      View
                    </span>
                  </td>
                  <td> 
                    <span className="text-blue cursor" onClick={() => { setSelectedUser(order); setShowUserModal(true); }}>
                      View User Info
                    </span>
                  </td>
                  <td>₹{order.totalAmount}</td>
                  <td style={{ minWidth: "150px" }}>
                    <CustomDropdown
                      value={order.orderStatus || ""}
                      onChange={(val) => handleStatusChange(val, order._id)}
                      options={[
                        { value: "Processing", label: "Processing" },
                        { value: "Shipped", label: "Shipped" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      placeholder="Select status"
                    />
                  </td>
                  <td>{order.date.split("T")[0]}</td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button className='error' color="error" onClick={() => handleDeleteOrder(order._id)}>
                        <MdDelete />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination 
          className='mt-3' style={{ marginBottom: '-20px' }} component="div" count={orders.length} page={page}
          onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[50, 100, 150, 200]} />
      </div>

      {/* Products Modal */}
      <Dialog open={isOpenModal} className="productModal" onClick={() => setIsOpenModal(false)}>
        <Button className="close_" onClick={() => setIsOpenModal(false)}>
          <MdClose />
        </Button>
        <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>

        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Product Id</th>
                <th>Product Title</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>SubTotal</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, i) => (
                <tr key={i}>
                  <td>{item.productId}</td>
                  <td>{item.name?.length > 40 ? item.name.slice(0, 40) + '...' : item.name}</td>
                  <td>
                    <div className="img">
                      <img src={item.image} alt="Product" width={60} />
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dialog>

      <Dialog open={showUserModal} className="productModal" onClose={() => setShowUserModal(false)}>
        <Button className="close_" onClick={() => setShowUserModal(false)}>
          <MdClose />
        </Button>
        <h4 className="mb-1 font-weight-bold pr-5 mb-4">User Info</h4>

        <div className="table-responsive orderTable">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {selectedUser && (
                <tr>
                  <td>{selectedUser.name}</td>
                  <td>{selectedUser.email}</td>
                  <td>{selectedUser.phone}</td>
                  <td>{selectedUser.address} :- {selectedUser.zipCode}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
};

export default Orders;
