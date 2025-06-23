import React from 'react';
import { Dialog, Button } from '@mui/material';
import { MdClose } from 'react-icons/md';

const OrdersProductDialog = ({ open, handleClose, products = [] }) => {
  return (
    <Dialog open={open} className="productModal" onClose={handleClose} maxWidth="md" fullWidth>
      <Button className="close_" onClick={handleClose}>
        <MdClose />
      </Button>

      <h4 className="mb-1 font-weight-bold pr-5 mb-4">Ordered Products</h4>

      <div className="table-responsive orderTable">
        <table className="table table-striped table-bordered">
          <thead className="thead-light">
            <tr>
              <th>Product Id</th>
              <th>Product Title</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="6">No product data</td></tr>
            ) : (
              products.map((product, index) => (
                <tr key={index}>
                  <td>{product.productId}</td>
                  <td style={{ whiteSpace: 'inherit' }}>
                    <span>{product.name}</span>
                  </td>
                  <td>
                    <div className="img" style={{ width: "60px" }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-100"
                      />
                    </div>
                  </td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price}</td>
                  <td>₹{product.subtotal}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Dialog>
  );
};

export default OrdersProductDialog;
