import React from 'react';
import { Dialog, Button } from '@mui/material';
import { MdClose } from 'react-icons/md';

const OrdersAddressDialog = ({ open, handleClose, address = "" }) => {
  return (
    <Dialog open={open} className="productModal" onClose={handleClose} maxWidth="sm" fullWidth>
      <Button className="close_" onClick={handleClose}>
        <MdClose />
      </Button>

      <h4 className="mb-4 font-weight-bold pr-5">Your Address</h4>

      <div className="px-4 pb-4">
        {address ? (
          <p className="mb-0" style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {address}
          </p>
        ) : (
          <p>No address data</p>
        )}
      </div>
    </Dialog>
  );
};

export default OrdersAddressDialog;
