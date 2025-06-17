import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import Rating from '@mui/material/Rating';
import Tooltip from '@mui/material/Tooltip';
import { BsCartFill } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
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
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(MyContext);
    const [adding, setAdding] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchDataFromApi(`/api/products/${id}`).then(res => {
            setProduct(res);
            setLoading(false);
        });
    }, [id]);

    const handleAddToCart = async () => {
        setAdding(true);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userEmail = userInfo?.email;

        const cartData = {
            productTitle: product.name,
            image: product.images?.[0] || '',
            rating: product.rating || "0",
            price: product.price,
            quantity: 1,
            subTotal: product.price * 1,
            productId: product._id,
            userEmail: userEmail,
        };

        try {
            const response = await fetch("http://localhost:4000/api/cart/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartData),
        });

        const savedItem = await response.json();

        if (!response.ok) {
            throw new Error(savedItem.error || "Failed to save in DB");
        }

        addToCart({ ...product, quantity: 1, _id: savedItem._id });

        enqueueSnackbar("✅ Item added to cart", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("❌ DB error: " + error.message, { variant: "error" });
        } finally {
            setAdding(false);
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
                                        <span className="text-light cursor ml-2">1 Review</span>
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
                                    <ul className="list list-inline mb-0 pl-4">
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
                                <QuantityBox/>
                                <Button className='btn-blue btn-lg btn-big btn-round bg-red ml-1' onClick={handleAddToCart}>
                                    <BsCartFill/>&nbsp;{adding ? "Adding..." : "Add to Cart"}
                                </Button>
                                <Tooltip title="Add to Wishlist" placement="top"><Button className='btn-blue btn-lg btn-big btn-circle ml-4'><FaRegHeart/></Button></Tooltip>
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
                                    onClick={() => {
                                        setActiveTabs(2);
                                    }}
                                >
                                    Reviews (3)
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
                                          <td>
                                            <p>35”L x 24”W x 37-45”H (front to back wheel)</p>
                                          </td>
                                        </tr>
                                        <tr className="folded-wo-wheels">
                                          <th>Folded (w/o wheels)</th>
                                          <td>
                                            <p>32.5"L x 18.5”W x 16.5”H</p>
                                          </td>
                                        </tr>
                                        <tr className="folded-w-wheels">
                                          <th>Folded (w/ wheels)</th>
                                          <td>
                                            <p>32.5"L x 24”W x 18.5”H</p>
                                          </td>
                                        </tr>
                                        <tr className="door-pass-through">
                                          <th>Door Pass Through</th>
                                          <td>
                                            <p>24"</p>
                                          </td>
                                        </tr>
                                        <tr className="weight-wo-wheels">
                                          <th>Weight (w/o wheels)</th>
                                          <td>
                                            <p>20 LBS</p>
                                          </td>
                                        </tr>
                                        <tr className="weight-capacity">
                                          <th>Weight Capacity</th>
                                          <td>
                                            <p>60 LBS</p>
                                          </td>
                                        </tr>
                                        <tr className="width">
                                          <th>Width</th>
                                          <td>
                                            <p>24"</p>
                                          </td>
                                        </tr>
                                        <tr className="handle-height-ground-to-handle">
                                          <th>Handle height (ground to handle)</th>
                                          <td>
                                            <p>37-45"</p>
                                          </td>
                                        </tr>
                                        <tr className="wheels">
                                          <th>Wheels</th>
                                          <td>
                                            <p>12” air / wide track slick tread</p>
                                          </td>
                                        </tr>
                                        <tr className="seat-back-height">
                                          <th>Seat back height</th>
                                          <td>
                                            <p>21.5"</p>
                                          </td>
                                        </tr>
                                        <tr className="head-room">
                                          <th>Head room (inside canopy)</th>
                                          <td>
                                            <p>25"</p>
                                          </td>
                                        </tr>
                                        <tr className="pa_color">
                                          <th>Color</th>
                                          <td>
                                            <p>Black, Blue, Red, White</p>
                                          </td>
                                        </tr>
                                        <tr className="pa_size">
                                          <th>Size</th>
                                          <td>
                                            <p>M, S</p>
                                          </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        }

                        {
                            activeTabs === 2 &&
                            <div className='row'>
                                <div className='col-md-8'>
                                    <h3>Customer questions & answer</h3>
                                    <br/>

                                    <div className='card p-4 reviewsCard flex-row'>
                                        <div className='image'>
                                            <div className="rounded-circle">
                                                <img src='https://wp.alithemes.com/html/nest/demo/assets/imgs/blog/author-2.png'/>
                                            </div>
                                            <span className='text-g d-block text-center font-weight-bold'>Vishesh Panchal</span>
                                        </div>
                                        <div className='info pl-5'>
                                            <div className='d-flex align-items-center w-100'>
                                                <h5 className='text-light'>03/05/2006</h5>
                                                <div className='ml-auto'>
                                                    <Rating name="half-rating-read" value={4.5} precision={0.5} readOnly size="small" />
                                                </div>
                                            </div>

                                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                        </div>
                                    </div>

                                    <br className='res-hide' /><br className='res-hide' />

                                    <form className='reviewForm'>
                                        <h4>Add a review</h4>
                                        <div className="form-group">
                                            <textarea className="form-control shadow" placeholder="Write a Review" name="review"></textarea>
                                        </div>

                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className='form-group'>
                                                        <input type='text' className='form-control' placeholder='Name' name='userName' />
                                                    </div>
                                                </div>

                                                <div className='col-md-6'>
                                                    <div className='form-group'>
                                                        <Rating name='rating' value={4.5} precision={0.5} />
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