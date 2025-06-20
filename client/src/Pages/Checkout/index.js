import { TextField, Button } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";

const CheckoutForm = () => {
  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm">
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Full Name *" name="fullName" size="small" fullWidth />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Country *" name="country" size="small" fullWidth />
                  </div>
                </div>
              </div>

              <h6>Street address *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="House number and street name" name="streetAddressLine1" size="small" fullWidth />
                  </div>
                  <div className="form-group">
                    <TextField label="Apartment, suite, unit, etc. (optional)" name="streetAddressLine2" size="small" fullWidth />
                  </div>
                </div>
              </div>

              <h6>Town / City *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="City" name="city" size="small" fullWidth />
                  </div>
                </div>
              </div>

              <h6>State / County *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="State" name="state" size="small" fullWidth />
                  </div>
                </div>
              </div>

              <h6>Postcode / ZIP *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="ZIP Code" name="zipCode" size="small" fullWidth />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Phone Number" name="phoneNumber" size="small" fullWidth />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Email Address" name="email" size="small" fullWidth />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">YOUR ORDER</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>CHUWI Intel Celeron ... <b>× 1</b></td>
                        <td>₹17,000.00</td>
                      </tr>
                      <tr>
                        <td>Subtotal</td>
                        <td>₹17,000.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button type="submit" className="btn-blue bg-red btn-lg btn-big" variant="contained" fullWidth startIcon={<IoBagCheckOutline />}>
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutForm;
