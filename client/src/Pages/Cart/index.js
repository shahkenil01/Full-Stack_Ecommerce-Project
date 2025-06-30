import { useContext } from "react";
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { IoBagCheckOutline, IoHome } from "react-icons/io5";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { MyContext } from "../../App";
import emptyCartImg from "../../assets/images/emptyCart.png";
import QuantityBox from '../../Components/QuantityBox';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartQuantity } = useContext(MyContext);
  if (cartItems === null) return null;

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const total = getTotal();
  const gstRate = total >= 1000 ? 0.12 : 0.12;
  const gstAmount = parseFloat((total * gstRate).toFixed(2));
  const deliveryCharge = total >= 1000 ? 0 : 45;
  const grandTotal = total + gstAmount + deliveryCharge;

  const truncateText = (text, limit = 30) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const removeFromCartAndDB = async (item) => {
    removeFromCart(item._id);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${item._id || item.cartId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to delete from DB");
    } catch (err) {
      console.error("Failed to delete from DB:", err.message);
    }
  };

  const updateQuantityInCart = (item, newQty) => {
    updateCartQuantity(item._id, newQty);

    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quantity: newQty,
        subTotal: item.price * newQty,
      }),
    }).catch(err => console.error("Failed to update cart DB", err));
  };

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd mb-1">Your Cart</h2>
          <p>
            There are <b className="text-red">{cartItems.length}</b> products in your cart
          </p>
          {cartItems.length === 0 ? (
            <div className="empty d-flex align-items-center justify-content-center flex-column">
              <img src={emptyCartImg} width="150" alt="empty cart" />
              <h3>Your Cart is currently empty</h3>
              <Link to="/">
                <Button className="btn-best mt-3">
                  <IoHome /> &nbsp; Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
          <div className="row">
            <div className="col-md-9 pr-5">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th width="35%">Products</th>
                      <th width="20%">Unit Price</th>
                      <th width="20%">Quantity</th>
                      <th width="15%">Subtotal</th>
                      <th width="10%">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                    <tr key={item._id}>
                      <td width="35%">
                        <Link to={`/product/${item.productId}`}>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={item.images?.[0] || item.image} className="w-100" />
                            </div>

                            <div className="info px-3">
                              <h6>{truncateText(item.name || item.productTitle)}</h6>
                              <Rating name="read-only" value={item.rating || 0} readOnly size="small" />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="20%">Rs {item.price}</td>
                      <td width="20%"> <QuantityBox quantity={item.quantity} setQuantity={(newQty) => updateQuantityInCart(item, newQty)}/> </td>
                      <td width="15%">Rs {item.price * item.quantity}</td>
                      <td width="10%">
                        <span className="remove" onClick={() => removeFromCartAndDB(item)}>
                          <IoIosClose />
                        </span>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card border p-3 cartDetails">
                <h4>CART TOTALS</h4>

                <div className='d-flex align-items-center mb-2'>
                  <span>Subtotal</span>
                  <span className="ml-auto text-red font-weight-bold">₹{getTotal()}</span>
                </div>
                <div className='d-flex align-items-center mb-2'>
                  <span>GST ({gstRate * 100}%)</span>
                  <span className="ml-auto text-red font-weight-bold">₹{gstAmount}</span>
                </div>
                <div className='d-flex align-items-center mb-2'>
                  <span>Delivery Charge</span>
                  <span className="ml-auto">{deliveryCharge > 0 ? `₹${deliveryCharge}` : "Free"}</span>
                </div>
                <div className='d-flex align-items-center mb-4'>
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">₹{grandTotal}</span>
                </div>
                <Link to={'/checkout'}><Button className='btn-blue btn-lg btn-big bg-red'><IoBagCheckOutline/>&nbsp; Checkout</Button></Link>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Cart;
