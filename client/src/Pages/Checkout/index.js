import { useState, useContext, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import { IoBagCheckOutline } from "react-icons/io5";
import { MyContext } from "../../App";
import { handlePayment } from "../../utils/handlePayment";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CheckoutForm = () => {

  const { cartItems } = useContext(MyContext);
  const { user } = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();

  const truncateChars = (text, limit = 20) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.email) {
      setFormFields(prev => ({
        ...prev,
        email: userInfo.email
      }));
    }
  }, []);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [formFields, setFormFields] = useState({
    fullName:"",
    country:"",
    streetAddressLine1:"",
    streetAddressLine2:"",
    city:"",
    state:"",
    zipCode:"",
    phoneNumber:"",
    email: user?.email || ""
  })

  const onChangeInput=(e)=>{
    setFormFields(()=>({
      ...formFields,
      [e.target.name]:e.target.value
    }))
  }

  const checkout = async (e) => {
    e.preventDefault();

    const requiredFields = ["fullName", "country", "streetAddressLine1", "city", "state", "zipCode", "phoneNumber", "email"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formFields[field].trim()) {
        newErrors[field] = true;
      }
    });

    if (Object.keys(newErrors).length === 0) {
      const orderToken = "ot_" + Date.now();
      try {
      const orderPayload = { cartItems, formFields };
      localStorage.setItem(`order_${orderToken}`, JSON.stringify(orderPayload));

      await handlePayment({
        amount: totalAmount,
        email: formFields.email,
        phoneNumber: formFields.phoneNumber,
        token: orderToken,
        enqueueSnackbar,
      });
    } catch (err) {
      enqueueSnackbar("Something went wrong during payment", { variant: "error" });
    }
    } else {
      enqueueSnackbar("Please fill all required fields", { variant: "error" });
    }
  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkoutForm" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Full Name *" variant="outlined" className="w-100" size="small" name="fullName"  onChange={onChangeInput}/>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Country *" variant="outlined" className="w-100" size="small" name="country" onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <h6>Street address *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="House number and street name" variant="outlined" className="w-100" size="small" name="streetAddressLine1" onChange={onChangeInput} />
                  </div>
                  <div className="form-group">
                    <TextField label="Apartment, suite, unit, etc. (optional)" variant="outlined" className="w-100" size="small" name="streetAddressLine2" onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <h6>Town / City *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="City" variant="outlined" className="w-100" size="small" name="city" onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <h6>State / County *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="State" variant="outlined" className="w-100" size="small" name="state" onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <h6>Postcode / ZIP *</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label="ZIP Code" variant="outlined" className="w-100" size="small" name="zipCode" onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Phone Number" variant="outlined" className="w-100" size="small" name="phoneNumber" onChange={onChangeInput} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Email Address" variant="outlined" className="w-100" size="small" name="email" value={formFields.email} disabled />
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
                      {cartItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {truncateChars(item.productTitle || item.name, 20)} <b>× {item.quantity}</b>
                          </td>
                          <td>₹ {item.price * item.quantity}</td>
                        </tr>
                      ))}
                      <tr>
                        <td>Subtotal</td>
                        <td>₹{totalAmount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Button type="submit" className="btn-blue bg-red btn-lg btn-big" variant="contained" startIcon={<IoBagCheckOutline />}>
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
