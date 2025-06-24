import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import { BsCartFill } from "react-icons/bs";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSnackbar } from "notistack";
import RelatedProducts from "./RelatedProducts";
import { MyContext } from "../../App";
import QuantityBox from "../../Components/QuantityBox";
import ProductZoom from "../../Components/ProductZoom"
import { fetchDataFromApi } from "../../utils/api";

const ProductDetails = () =>{

    const [activeSize, setActiveSize] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);

    const isActive = (index) => {
        setActiveSize(index);
    }

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [showSelectionError, setShowSelectionError] = useState(false);
    const [loading, setLoading] = useState(true);
    const { addToCart, cartItems } = useContext(MyContext);
    const [adding, setAdding] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("Add to Cart");
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [userName, setUserName] = useState("");
    const [rating, setRating] = useState(0);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const toastRef = useRef(null);

    useEffect(() => {
        fetchDataFromApi(`/api/products/${id}`).then(res => {
            setProduct(res);
            setLoading(false);
        });

            fetchDataFromApi(`/api/reviews/product/${id}`).then(res => {
            setReviews(res);
        });
    }, [id]);

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo?.email && product?._id) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/user/${userInfo.email}`)
                .then(res => res.json())
                .then(data => {
                    const match = data.find(item => item.productId === product._id);
                    setIsFavorite(!!match);
                });
        } 
    }, [product]);

    const handleAddToCart = async () => {
        if ((product.productRAMS?.length > 0 || product.productSIZE?.length > 0 || product.productWEIGHT?.length > 0) && activeSize === null) {
            setShowSelectionError(true);
            return;
        }

        setShowSelectionError(false);
        setButtonLabel("Adding...");
        setAdding(true);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userEmail = userInfo?.email;

        const cartData = {
            productTitle: product.name,
            image: product.images?.[0] || '',
            rating: product.rating || "0",
            price: product.price,
            quantity: quantity,
            subTotal: product.price * quantity,
            productId: product._id,
            userEmail: userEmail,
        };

        try {
            const existingItem = cartItems.find(
                item => item.productId === product._id || item._id === product._id
            );

            if (userEmail) {
                if (existingItem) {
                    const updatedQty = existingItem.quantity + quantity;

                    await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${existingItem.cartId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            quantity: updatedQty,
                            subTotal: updatedQty * product.price,
                        }),
                    });

                    addToCart({ ...product, cartId: existingItem.cartId, productId: product._id }, quantity);
                    enqueueSnackbar("Quantity updated in cart", { variant: "success" });
                } else {
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/add`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(cartData),
                    });

                    const savedItem = await response.json();

                    if (!response.ok) {
                        throw new Error(savedItem.error || "Failed to save in DB");
                    }

                    addToCart({ ...product, quantity, cartId: savedItem._id, productId: product._id }, quantity);
                    enqueueSnackbar("Item added to cart", { variant: "success" });
                }

            } else {
                if (existingItem) {
                    addToCart({ ...existingItem }, quantity);
                    enqueueSnackbar("Quantity updated in cart", { variant: "success" });
                } else {
                    addToCart({ ...product, quantity, productId: product._id }, quantity);
                    enqueueSnackbar("Item added to cart (Please LogIn To Continue)", { variant: "success" });
                }
            }

        } catch (error) {
          enqueueSnackbar("DB error: " + error.message, { variant: "error" });
        } finally {
          setButtonLabel("Add to Cart");
          setAdding(false);
        }
    };

    const handleAddToFavorite = async () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo?.email) {
            enqueueSnackbar("Please login to use wishlist", { variant: "error" });
            return;
        }

        const favData = {
            productId: product._id,
            userEmail: userInfo.email,
            name: product.name,
            image: product.images?.[0] || '',
            rating: product.rating || 0,
            price: product.price,
        };

        try {
            if (toastRef.current) {
                closeSnackbar(toastRef.current);
            }
            let newToastKey = null;
            if (isFavorite) {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/remove`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product._id, userEmail: userInfo.email }),
                });
                newToastKey = enqueueSnackbar("Removed from favorites", { variant: "success" });
            } else {
                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/add`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(favData),
                });
                newToastKey = enqueueSnackbar("Added to favorites", { variant: "success" });
            }
            toastRef.current = newToastKey;
            setIsFavorite(!isFavorite);
        } catch (error) {
            enqueueSnackbar("Error updating favorites", { variant: "error" });
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userName = userInfo?.name;
        if (!userName) {
            enqueueSnackbar("Login required to post a review", { variant: "error" });
            return;
        }
        try {
            const payload = {
                productId: id,
                userName,
                reviewText: reviewText,
                rating,
            };
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/reviews/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to submit review");

            const newReview = await response.json();
            setReviews(prev => [newReview, ...prev]); 
            setReviewText(""); setUserName(""); setRating(0);
            enqueueSnackbar("Review submitted!", { variant: "success" });
        } catch (err) {
            enqueueSnackbar("Error: " + err.message, { variant: "error" });
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);

    return(
        <>
            <section className="productDetails section">
                <div className="container">
                    {loading || !product ? (
                        <div className="text-center mt-5 mb-5">
                            <div
                                className="spinner-border mt-5 mb-5"
                                role="status"
                                style={{ width: '3rem', height: '3rem', color: '#6d4aae' }}>
                            </div>
                        </div>
                    ) : (
                    <div className="row">
                        <div className="col-md-4">
                            <ProductZoom images={product.images} price={product.price} oldPrice={product.oldPrice}/>
                        </div>

                        <div className="col-md-8">
                            <h2 className="hd text-capitalize">{product.name}</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light mr-2">Brands :</span>
                                        <span>{product.brand}</span>
                                    </div>
                                </li>
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <Rating name="read-only" value={product.rating || 0} precision={0.5} size="small" readOnly />
                                        <span className="text-light cursor ml-2">{reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex info">
                                <span className="oldPrice">Rs: {product.oldPrice}</span>
                                <span className="netPrice text-danger ml-2">Rs: {product.price}</span>
                            </div>
                            <span className={`badge mt-3 ${product.countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                {product.countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                            </span>
                            <p className="mt-3">{product.description}</p>
                            {(product.productRAMS?.length > 0 || product.productSIZE?.length > 0 || product.productWEIGHT?.length > 0) && (
                                <div className="productSize d-flex align-items-center mt-4">
                                    <span>
                                        {product.productRAMS?.length > 0 && "RAM:"}
                                        {product.productSIZE?.length > 0 && "Size:"}
                                        {product.productWEIGHT?.length > 0 && "Weight:"}
                                    </span>
                                    <ul className={`list list-inline mb-0 pl-4 ${showSelectionError && activeSize === null ? 'error' : ''}`}>
                                        {product.productRAMS?.map((ram, idx) => (
                                            <li className='list-inline-item' key={`ram-${idx}`}>
                                                <a className={`tag ${activeSize === idx ? 'active' : ''}`} onClick={() => isActive(idx)}>
                                                    {ram}
                                                </a>
                                            </li>
                                        ))}
                                        {product.productSIZE?.map((size, idx) => (
                                            <li className='list-inline-item' key={`size-${idx}`}>
                                                <a className={`tag ${activeSize === idx ? 'active' : ''}`} onClick={() => isActive(idx)}>
                                                    {size}
                                                </a>
                                            </li>
                                        ))}
                                        {product.productWEIGHT?.map((weight, idx) => (
                                            <li className='list-inline-item' key={`weight-${idx}`}>
                                                <a className={`tag ${activeSize === idx ? 'active' : ''}`} onClick={() => isActive(idx)}>
                                                    {weight}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="d-flex align-items-center mt-4">
                                <QuantityBox quantity={quantity} setQuantity={setQuantity}/>
                                <Button className='btn-best ml-1' onClick={handleAddToCart}>
                                    <BsCartFill/>&nbsp;{buttonLabel}
                                </Button>
                                <Tooltip title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"} placement="top">
                                    <Button className="btn-blue btn-lg btn-big btn-circle ml-4" onClick={handleAddToFavorite}>
                                        {isFavorite ? <FaHeart className="text-danger" /> : <FaRegHeart />}
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>)}

                    <br/>

                    <div className="card mt-5 pt-5 detailsPageTabs">
                        <div className='customTabs mr-5 ml-5'>
                        <ul className="list-inline">
                            <li className="list-inline-item mt-2">
                                <Button
                                    className={`${activeTabs === 0 && 'active'}`}
                                    onClick={() => setActiveTabs(0)}
                                >Description</Button>
                            </li>
                            <li className="list-inline-item">
                                <Button
                                    className={`${activeTabs === 1 && 'active'}`}
                                    onClick={() => setActiveTabs(1)}
                                >
                                    Additional info
                                </Button>
                            </li>
                            <li className="list-inline-item">
                                <Button
                                    className={`${activeTabs === 2 && 'active'}`}
                                    onClick={() => { setActiveTabs(2); }}>
                                    Reviews ({reviews.length})
                                </Button>
                            </li>
                        </ul>


                        {activeTabs === 0 && 
                            <div className="tabContent mt-4">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.ac
                            </div>
                        }

                        <br/>

                        {activeTabs === 1 &&
                            <div className="tabContent">
                                <div className="table-responsive">
                                    <table className="table table-bordered mb-5">
                                        <tbody>
                                        <tr className="stand-up">
                                          <th>Stand Up</th>
                                          <td> <p>35”L x 24”W x 37-45”H (front to back wheel)</p> </td>
                                        </tr>
                                        <tr className="folded-wo-wheels">
                                          <th>Folded (w/o wheels)</th>
                                          <td> <p>32.5"L x 18.5”W x 16.5”H</p> </td>
                                        </tr>
                                        <tr className="folded-w-wheels">
                                          <th>Folded (w/ wheels)</th>
                                          <td> <p>32.5"L x 24”W x 18.5”H</p> </td>
                                        </tr>
                                        <tr className="door-pass-through">
                                          <th>Door Pass Through</th>
                                          <td> <p>24"</p> </td>
                                        </tr>
                                        <tr className="weight-wo-wheels">
                                          <th>Weight (w/o wheels)</th>
                                          <td> <p>20 LBS</p> </td>
                                        </tr>
                                        <tr className="weight-capacity">
                                          <th>Weight Capacity</th>
                                          <td> <p>60 LBS</p> </td>
                                        </tr>
                                        <tr className="width">
                                          <th>Width</th>
                                          <td> <p>24"</p> </td>
                                        </tr>
                                        <tr className="handle-height-ground-to-handle">
                                          <th>Handle height (ground to handle)</th>
                                          <td> <p>37-45"</p> </td>
                                        </tr>
                                        <tr className="wheels">
                                          <th>Wheels</th>
                                          <td> <p>12” air / wide track slick tread</p> </td>
                                        </tr>
                                        <tr className="seat-back-height">
                                          <th>Seat back height</th>
                                          <td> <p>21.5"</p> </td>
                                        </tr>
                                        <tr className="head-room">
                                          <th>Head room (inside canopy)</th>
                                          <td> <p>25"</p> </td>
                                        </tr>
                                        <tr className="pa_color">
                                          <th>Color</th>
                                          <td> <p>Black, Blue, Red, White</p> </td>
                                        </tr>
                                        <tr className="pa_size">
                                          <th>Size</th>
                                          <td> <p>M, S</p> </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        }

                        {
                            activeTabs === 2 &&
                            <div className='row'>
                                <div className='col-md-7'>
                                    <h3>Customer questions & answer</h3>
                                    <br/>

                                    {reviews.length === 0 ? (
                                        <p>No reviews yet.</p>
                                    ) : (
                                        reviews.map((review, index) => (
                                            <div className='card p-4 reviewsCard flex-row mb-3' key={index}>
                                                <div className='image'>
                                                    <div className="rounded-circle">
                                                        <img src={`https://ui-avatars.com/api/?name=${review.userName?.charAt(0)}&background=random&color=fff&bold=true`} alt={review.userName} />
                                                    </div>
                                                    <span className='text-g d-block text-center font-weight-bold'>{review.userName}</span>
                                                </div>
                                                <div className='info pl-5'>
                                                    <div className='d-flex align-items-center w-100'>
                                                        <h5 className='text-light'>{new Date(review.createdAt).toLocaleDateString()}</h5>
                                                        <div className='ml-auto'>
                                                            <Rating name="read-only" value={review.rating} readOnly precision={0.5} size="small" />
                                                        </div>
                                                    </div>
                                                    <p>{review.reviewText}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    <br className='res-hide' /><br className='res-hide' />

                                    <form className='reviewForm' onSubmit={handleReviewSubmit}>
                                        <h4>Add a review</h4>
                                        <div className="form-group">
                                            <textarea className="form-control shadow" placeholder="Write a Review" name="review"  value={reviewText} onChange={(e) => setReviewText(e.target.value)}></textarea>
                                        </div>

                                        <div className='row'>

                                            <div className='col-md-6'>
                                                <div className='form-group'>
                                                    <Rating name='rating' value={rating} precision={0.5} onChange={(e, newValue) => setRating(newValue)} size="medium"/>
                                                </div>
                                            </div>
                                        </div>

                                        <br/>
                                        <div className='form-group'>
                                            <Button type='submit' className='btn-blue btn-lg btn-big btn-round'>Submit Review</Button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        </div>
                    </div>

                    <br/>

                    {product && (
                        <RelatedProducts key={product._id} subcategoryId={product.subcategory?._id} categoryId={product.category?._id} currentProductId={product._id} />
                    )}

                </div>
            </section>
        </>
    )
}

export default ProductDetails