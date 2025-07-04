import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../../../App";
import axios from "axios";
import { Card, CardHeader, CardContent, Typography, Divider, Chip, Avatar, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Grid, Tooltip } from "@mui/material";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { MdInfo, MdShoppingBasket } from "react-icons/md";
import { LocalShipping, Payment, Home, Person, Email, Phone, TrackChanges } from '@mui/icons-material';
import { TrackingModal } from "./TrackingModal";

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  const { user } = useContext(MyContext);

  const fetchOrders = () => {
    if (!user?.email) return;

    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user.email}`)
      .then((res) => setOrders(res.data.sort((a, b) => new Date(b.date) - new Date(a.date))))
      .catch((err) => console.error("❌ Failed to fetch orders:", err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user?.email) return;
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders();
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const handleModalClose = () => {
    setIsTrackingOpen(false);
    setSelectedOrder(null);
    fetchOrders();
  };

  if (!loading && orders.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, mb: 5 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 600 }}>
          Your Orders
        </Typography>
        <Paper elevation={3} sx={{ textAlign: 'center', p: 4, borderRadius: 2, backgroundColor: 'background.paper' }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>
            No orders found
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            You haven't placed any orders yet. Start shopping to see your orders here!
          </Typography>
          <Link to="/"><Button variant="contained" color="primary" sx={{ mt: 3 }} startIcon={<MdShoppingBasket />}>
            Browse Products
          </Button></Link>
        </Paper>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'success';
      case 'processing': return 'default';
      case 'shipped': return 'secondary';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Your Orders
      </Typography>

      {orders.map((order) => (
        <Card key={order._id} sx={{ mb: 4, boxShadow: 3 }}>
          <CardHeader
            title={
              <Typography variant="h6" component="div">
                Order #{order._id.slice(-6).toUpperCase()}
              </Typography>
            }
            subheader={
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  Placed on {new Date(order.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
                <Chip
                  icon={<LocalShipping fontSize="small" />}
                  label={order.orderStatus}
                  color={getStatusColor(order.orderStatus)}
                  variant="outlined"
                  size="small"
                  sx={ order.orderStatus.toLowerCase() === 'processing'
                      ? {
                          color: '#000',
                          borderColor: 'transparent',
                          backgroundColor: '#fff3e0',
                          fontWeight: 600,
                        }
                      : {}
                  }
                />
              </Box>
            }
            action={
              <Tooltip title="Payment details">
                <Chip
                  icon={<Payment fontSize="small" />}
                  label={order.paymentMethod || "N/A"}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Tooltip>
            }
            sx={{
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
              '& .MuiCardHeader-subheader': {
                color: 'primary.contrastText'
              }
            }}
          />

          <CardContent>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              Ordered Items
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'grey.100' }}>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products.map((prod, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={prod.image}
                            alt={prod.name}
                            variant="rounded"
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                          <Typography variant="body2">
                            {prod.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">₹{prod.price.toFixed(2)}</TableCell>
                      <TableCell align="center">{prod.quantity}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          ₹{(prod.price * prod.quantity).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Shipping Information
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" paragraph>
                    <strong>{order.name}</strong>
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <Email fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {order.email}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <Phone fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {order.phone}
                  </Typography>
                  <Typography variant="body2">
                    <Home fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    {order.address}, {order.city}, {order.state}, {order.country} - {order.zipCode}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2">₹{order.totalAmount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2">Free</Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1" fontWeight="medium">Total:</Typography>
                    <Typography variant="body1" fontWeight="medium">₹{order.totalAmount.toFixed(2)}</Typography>
                  </Box>

                  {order.paymentId && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Tooltip title={order.paymentId}>
                        <Button fullWidth variant="outlined" color="info" size="small" startIcon={<MdInfo />} sx={{ mt: 1 }}>
                          Payment ID: {order.paymentId}
                        </Button>
                      </Tooltip>
                    </>
                  )}

                  <Button fullWidth variant="contained" color="secondary" size="small" startIcon={<TrackChanges />}
                    onClick={() => { setSelectedOrder(order); setIsTrackingOpen(true); }} sx={{ mt: 2 }} >
                    Track Order
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {selectedOrder && (
        <TrackingModal open={isTrackingOpen} onClose={handleModalClose} orderId={selectedOrder._id} orderDate={selectedOrder.date} />
      )}
    </Box>
  );
};

export default OrdersTable;