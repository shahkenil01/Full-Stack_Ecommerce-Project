import React, { useState } from 'react';
import OrdersProductDialog from '../../Components/OrderProductModel';

const OrdersTable = () => {
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

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
              <tr>
                <td>
                  <span className="text-blue font-weight-bold">
                    6856d00aef1b4eb89bda915d
                  </span>
                </td>
                <td>
                  <span className="text-blue font-weight-bold">
                    pay_Qjtbym57c4WU6y
                  </span>
                </td>
                <td>
                  <span className="text-blue font-weight-bold cursor" onClick={handleOpenDialog} style={{ cursor: 'pointer' }}>
                    Click here to view
                  </span>
                </td>
                <td>Kenil Shah</td>
                <td>2</td>
                <td>wdOpt.,lake garden</td>
                <td>a</td>
                <td>260</td>
                <td>kenilshah765@gmail.com</td>
                <td>6856cf47ef1b4eb89bda8e0c</td>
                <td>
                  <span className="badge badge-danger">pending</span>
                </td>
                <td>2025-06-21</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <OrdersProductDialog open={open} handleClose={handleCloseDialog} />

    </section>
  );
};

export default OrdersTable;
