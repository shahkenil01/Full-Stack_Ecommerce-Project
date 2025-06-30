import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Stepper, Step, StepLabel, Typography, Button, Box, StepConnector, Zoom, } from '@mui/material';
import { styled } from '@mui/material/styles';
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { FaBoxOpen, FaShippingFast, FaTruckLoading } from "react-icons/fa";
import { motion } from "framer-motion";

const ColorConnector = styled(StepConnector)(({ theme }) => ({
  '&.MuiStepConnector-root': {  top: 20 },
  '& .MuiStepConnector-line': {
    borderTopStyle: 'dotted',
    borderTopWidth: 3,
    transition: 'all 0.3s ease',
  },
  '&.Mui-active .MuiStepConnector-line': { borderColor: 'green' },
  '&.Mui-completed .MuiStepConnector-line': { borderColor: 'green' },
  '&:not(.Mui-completed):not(.Mui-active) .MuiStepConnector-line': { borderColor: '#d1d5db' }
}));

export const TrackingModal = ({ open, onClose, orderId, orderDate }) => {
  const [order, setOrder] = useState(null);
  const fetchOrder = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(err => console.error("❌ Error fetching order:", err.message));
  };

  useEffect(() => {
    if (!open || !orderId) return;

    fetchOrder();
    const interval = setInterval(fetchOrder, 1000);

    return () => clearInterval(interval);
  }, [orderId, open]);

  if (!order) return null;

  const rawStatus = (order?.orderStatus || "pending").trim().toLowerCase();
  const currentStatus = rawStatus === "cancelled" ? "cancelled" : rawStatus;

  const steps = currentStatus === "cancelled"
    ? [
        {
          label: 'Order Placed',
          description: 'We received your order',
          icon: FaBoxOpen,
          status: ['pending'],
        },
        {
          label: 'Cancelled',
          description: 'Your order was cancelled. Please check your email.',
          icon: MdCancel,
          status: ['cancelled'],
        },
      ]
    : [
        {
          label: 'Order Placed',
          description: 'We received your order',
          icon: FaBoxOpen,
          status: ['pending'],
        },
        {
          label: 'Processing',
          description: 'We\'re preparing your order',
          icon: FaTruckLoading,
          status: ['processing'],
        },
        {
          label: 'Shipped',
          description: 'Your order is on the way',
          icon: FaShippingFast,
          status: ['shipped'],
        },
        {
          label: 'Delivered',
          description: 'Order successfully delivered',
          icon: MdCheckCircle,
          status: ['completed', 'delivered'],
        },
      ];

  const currentStepIndex = steps.findIndex(step =>
    step.status.includes(currentStatus)
  );
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, color: '#6d4aae' }}>
        Track Your Order
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} alternativeLabel connector={<ColorConnector />} >
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isCompleted = index < activeStep;
            const isActive = index === activeStep;

            return (
              <Step key={step.label} completed={isCompleted}>
                <StepLabel icon={
                    <Zoom in>
                      <Box sx={{ p: 1, borderRadius: '50%' }}>
                        <IconComponent size={24} color={
                          step.label.toLowerCase() === 'cancelled'
                            ? 'red'
                            : isCompleted || isActive
                            ? 'green'
                            : 'gray'
                          } />
                      </Box>
                    </Zoom>
                  }
                  sx={{ '& .MuiStepLabel-label': { fontWeight: 600, color: step.label.toLowerCase() === 'cancelled' ? 'error.main' : '#1a1a1a',
                      px: 2, py: 1, borderRadius: '12px' },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2">{step.label}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {index === 0
                        ? new Date(orderDate).toLocaleString()
                        : step.description}
                    </Typography>
                  </Box>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ backgroundColor: '#6d4aae', '&:hover': { backgroundColor: '#53348c' } }} >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
