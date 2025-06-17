import { useContext } from "react";
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { IoBagCheckOutline } from "react-icons/io5";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { MyContext } from "../../App";
import QuantityBox from '../../Components/QuantityBox';

const Cart = () => {
  const { cartItems, removeFromCart } = useContext(MyContext);

  const truncateText = (text, limit = 30) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit) + "..." : text;
  };

  const getTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const removeFromCartAndDB = async (item) => {
    removeFromCart(item._id);

    try {
      const response = await fetch(`http://localhost:4000/api/cart/${item._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete from DB");
      }
    } catch (err) {
      console.error("❌ Failed to delete from DB:", err.message);
    }
  };

  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <h2 className="hd mb-1">Your Cart</h2>
          <p>
            There are <b className="text-red">{cartItems.length}</b> products in your cart
          </p>
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
                        <Link to={`/product/${item._id}`}>
                          <div className="d-flex align-items-center cartItemimgWrapper">
                            <div className="imgWrapper">
                              <img src={item.images?.[0]} className="w-100" />
                            </div>

                            <div className="info px-3">
                              <h6>{truncateText(item.name)}</h6>
                              <Rating name="read-only" value={item.rating || 0} readOnly size="small" />
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td width="20%">Rs {item.price}</td>
                      <td width="20%"> <QuantityBox item={item}/> </td>
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

                <div className='d-flex align-items-center mb-3'>
                  <span>Subtotal</span>
                  <span className="ml-auto text-red font-weight-bold">₹{getTotal()}</span>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <span>Shipping</span>
                  <span className="ml-auto"><b>Free</b></span>
                </div>
                <div className='d-flex align-items-center mb-3'>
                  <span>Estimate for</span>
                  <span className="ml-auto"><b>India</b></span>
                </div>
                <div className='d-flex align-items-center mb-4'>
                  <span>Total</span>
                  <span className="ml-auto text-red font-weight-bold">₹{getTotal()}</span>
                </div>
                <Button className='btn-blue btn-lg btn-big bg-red'><IoBagCheckOutline/>&nbsp; Checkout</Button>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
