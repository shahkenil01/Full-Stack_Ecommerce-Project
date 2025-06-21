import React from 'react';
import { Dialog, Button } from '@mui/material';
import { MdClose } from 'react-icons/md';

const OrdersProductDialog = ({ open, handleClose }) => {
  return (
    <Dialog open={open} className="productModal" onClose={handleClose} maxWidth="md" fullWidth>
      <Button className="close_" onClick={handleClose}>
        <MdClose />
      </Button>

      <h4 className="mb-1 font-weight-bold pr-5 mb-4">Products</h4>

      <div className="table-responsive orderTable">
        <table className="table table-striped table-bordered">
          <thead className="thead-light">
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
            <tr>
              <td>66e68a4549fb19355a7a0c1b</td>
              <td style={{ whiteSpace: 'inherit' }}>
                <span>SIRIMIRI SMER-1011 German Silv...</span>
              </td>
              <td>
                <div className="img">
                  <img
                    src="https://api.spicezgold.com/download/file_1734528393445_sukkhi-ethnic-gold-plated-set-of-2-pair-temple-stud-earring-combo-for-women-product-images-rvs6la4c33-0-202202250141.jpg"
                    alt="Product"
                  />
                </div>
              </td>
              <td>1</td>
              <td>260</td>
              <td>260</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Dialog>
  );
};

export default OrdersProductDialog;
