import { useEffect, useContext, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../App";
import axios from "axios";
import { Box, CircularProgress, Typography, Alert, Button, Paper, Stack } from "@mui/material";
import { CheckCircle, Error, Payment, ShoppingCart } from "@mui/icons-material";

const OrderStatus = () => {
  const { user, setCartItems } = useContext(MyContext);
  const hasSavedRef = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const paymentResult = params.get("paid");

  // Parse stored order data
  let cart = [];
  let formFields = {};
  let shouldSave = paymentResult === "true";

  if (token) {
    try {
      const raw = localStorage.getItem(`order_${token}`);
      if (raw) {
        const stored = JSON.parse(raw);
        cart = stored?.cartItems || [];
        formFields = stored?.formFields || {};
        
        // Send temp data to backend
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/save-temp`, {
          token,
          cartItems: cart,
          formFields
        }).catch(e => {
          console.error("Failed to save temp order:", e);
        });
      }
    } catch (e) {
      console.error("Failed to decode order data:", e);
      setError("Failed to process your order data. Please contact support.");
    }
  }

  useEffect(() => {
    // Redirect if not from payment flow
    if (!token || paymentResult !== "true") {
      navigate('/orders');
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

          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/save-temp`, {
            token,
            cartItems: cart,
            formFields
          });

          await new Promise(resolve => setTimeout(resolve, 3000));

          let attempts = 0;
          while (attempts < 10) {
            const res = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/api/orders/user/${user.email}`
            );

            if (Array.isArray(res.data) && res.data.length > 0) {
              setPaymentStatus("success");
              break;
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
            attempts++;
          }

          if (attempts === 10) {
            setPaymentStatus("pending");
            setError("Payment confirmation is taking longer than expected. Your order may still process.");
          }

          localStorage.removeItem(`order_${token}`);
          localStorage.removeItem(`cf_order_${token}`);
          setCartItems([]);
        }
      } catch (err) {
        console.error("❌ Order processing failed:", err.message);
        setPaymentStatus("error");
        setError("Something went wrong while confirming your order.");
      } finally {
        setLoading(false);
      }
    };

    saveAndProcessOrder();
  }, [token, user, navigate, paymentResult]);

  const handleViewOrders = () => {
    navigate('/orders', { replace: true });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 4 }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
        <Typography variant="h5" gutterBottom>
          Processing Your Order
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
          We're confirming your payment details. This may take a moment...
        </Typography>
        <Payment sx={{ fontSize: 80, color: 'action.disabled', mt: 4, opacity: 0.6 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 4 }}>
        <Error color="error" sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Order Processing Issue
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
          {error}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/contact')} >
            Contact Support
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </Stack>
      </Box>
    );
  }

  if (paymentStatus === "success") {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4
      }}>
        <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Payment Successful!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 500 }}>
          Your order has been confirmed and is being processed. You'll receive a confirmation email shortly.
        </Typography>
        <Paper elevation={0} sx={{ 
          p: 3,  mb: 4, border: '1px solid', borderColor: 'success.light', backgroundColor: 'success.lightest'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Order Reference: {token?.slice(0, 8)}...{token?.slice(-4)}
          </Typography>
        </Paper>
        <Button variant="contained" size="large" startIcon={<ShoppingCart />} onClick={handleViewOrders}>
          View Your Orders
        </Button>
      </Box>
    );
  }

  if (paymentStatus === "pending") {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        p: 4
      }}>
        <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Payment Processing
        </Typography>
        <Alert severity="info" sx={{ mb: 3, maxWidth: 500 }}>
          Your payment is still being processed. This may take a few minutes. Please check back later or check your email for updates.
        </Alert>
        <Button 
          variant="outlined" 
          onClick={handleViewOrders}
        >
          Check Order Status
        </Button>
      </Box>
    );
  }

  // Default case - shouldn't happen
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Order Processing Complete
      </Typography>
      <Button variant="contained" onClick={handleViewOrders}>
        View Your Orders
      </Button>
    </Box>
  );
};

export default OrderStatus;