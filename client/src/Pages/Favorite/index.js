import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { IoHome } from "react-icons/io5";
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import emptyListImg from "../../assets/images/emptyList.png";


const Favorite = () => {
  const [favoritesItems, setFavoritesItems] = useState([]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo?.email) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/user/${userInfo.email}`)
        .then(res => res.json())
        .then(data => {
          setFavoritesItems(data || []); 
        })
        .catch(err => {
          console.error("Failed to fetch favorites:", err);
          setFavoritesItems([]);
        });
    }
  }, []);

  const handleRemove = async (favId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/${favId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFavoritesItems(prev => prev.filter(item => item._id !== favId));
      }
    } catch (err) {
      console.error("Failed to remove from favorites", err);
    }
  };
  return (
    <>
      <section className="section cartPage">
        <div className="container">
          <div className='myListTableWrapper'>
            <h2 className="hd mb-1">My List</h2>
            <p>
              There are <b className="text-red">{favoritesItems.length}</b> products in your My List
            </p>

            {favoritesItems.length === 0 ? (
              <div className="empty d-flex align-items-center justify-content-center flex-column">
                <img src={emptyListImg} width="150" alt="empty" />
                <h3>Your list is currently empty</h3>
                <Link to="/">
                  <Button className="btn-best mt-3">
                    <IoHome /> &nbsp; Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-12 pr-5">
                  <div className="table-responsive myListTable">
                    <table className="table">
                      <thead>
                        <tr>
                          <th width="35%">Products</th>
                          <th width="20%">Unit Price</th>
                          <th width="10%">Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {favoritesItems.map((item, index) => (
                          <tr key={index}>
                            <td width="35%">
                              <Link to={`/product/${item.productId}`}>
                                <div className="d-flex align-items-center cartItemimgWrapper">
                                  <div className="imgWrapper">
                                    <img src={item.image} className="w-100" alt="product" />
                                  </div>
                                  <div className="info px-3">
                                    <h6>{item.name}</h6>
                                    <Rating name="read-only" value={item.rating || 0} readOnly size="small" />
                                  </div>
                                </div>
                              </Link>
                            </td>
                            <td width="20%">Rs {item.price}</td>
                            <td width="10%">
                              <span className="remove" onClick={() => handleRemove(item._id)}>
                                <IoIosClose />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Favorite;
