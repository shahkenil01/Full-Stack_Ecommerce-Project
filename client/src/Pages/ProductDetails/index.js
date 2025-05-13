import ProductZoom from "../../Components/ProductZoom"
import Rating from '@mui/material/Rating';
import QuantityBox from "../../Components/QuantityBox";
import { Button } from "@mui/material";
import { BsCartFill } from "react-icons/bs";
import { useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import Tooltip from '@mui/material/Tooltip';
import RelatedProducts from "./RelatedProducts";

const ProductDetails = () =>{

    const [activeSize, setActiveSize] = useState(null);
    const [activeTabs, setActiveTabs] = useState(0);

    const isActive = (index) => {
        setActiveSize(index);
    }

    return(
        <>
            <section className="productDetails section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-4">
                            <ProductZoom/>
                        </div>

                        <div className="col-md-8">
                            <h2 className="hd text-capitalize">Men Alias-N Regular Fit Spread Collar Shirt</h2>
                            <ul className="list list-inline d-flex align-items-center">
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <span className="text-light mr-2">Brands :</span>
                                        <span>Welch's</span>
                                    </div>
                                </li>
                                <li className="list-inline-item">
                                    <div className="d-flex align-items-center">
                                        <Rating name="read-only" value={4.5} precision={0.5} size="small" readOnly />
                                        <span className="text-light cursor ml-2">1 Review</span>
                                    </div>
                                </li>
                            </ul>
                            <div className="d-flex info">
                                <span className="oldPrice">Rs: 1000</span>
                                <span className="netPrice text-danger ml-2">Rs: 500</span>
                            </div>
                            <span class="badge bg-success mt-3">IN STOCK</span>
                            <p className="mt-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                            </p>
                            <div className="productSize d-flex align-items-center mt-4">
                                <span>Size / Weight:</span>
                                <ul className="list list-inline mb-0 pl-4">
                                    <li className='list-inline-item'>
                                        <a className={`tag ${activeSize === 0 ? 'active' : ''}`} onClick={() => isActive(0)}>50G</a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className={`tag ${activeSize === 1 ? 'active' : ''}`} onClick={() => isActive(1)}>100G</a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className={`tag ${activeSize === 2 ? 'active' : ''}`} onClick={() => isActive(2)}>150G</a>
                                    </li>
                                    <li className='list-inline-item'>
                                        <a className={`tag ${activeSize === 3 ? 'active' : ''}`} onClick={() => isActive(3)}>200G</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="d-flex align-items-center mt-4">
                                <QuantityBox/>
                                <Button className='btn-blue btn-lg btn-big btn-round bg-red ml-1'><BsCartFill/>&nbsp;Add to Cart</Button>
                                <Tooltip title="Add to Wishlist" placement="top"><Button className='btn-blue btn-lg btn-big btn-circle ml-4'><FaRegHeart/></Button></Tooltip>
                            </div>
                        </div>
                    </div>

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
                                        <tr class="stand-up">
                                          <th>Stand Up</th>
                                          <td>
                                            <p>35”L x 24”W x 37-45”H (front to back wheel)</p>
                                          </td>
                                        </tr>
                                        <tr class="folded-wo-wheels">
                                          <th>Folded (w/o wheels)</th>
                                          <td>
                                            <p>32.5"L x 18.5”W x 16.5”H</p>
                                          </td>
                                        </tr>
                                        <tr class="folded-w-wheels">
                                          <th>Folded (w/ wheels)</th>
                                          <td>
                                            <p>32.5"L x 24”W x 18.5”H</p>
                                          </td>
                                        </tr>
                                        <tr class="door-pass-through">
                                          <th>Door Pass Through</th>
                                          <td>
                                            <p>24"</p>
                                          </td>
                                        </tr>
                                        <tr class="weight-wo-wheels">
                                          <th>Weight (w/o wheels)</th>
                                          <td>
                                            <p>20 LBS</p>
                                          </td>
                                        </tr>
                                        <tr class="weight-capacity">
                                          <th>Weight Capacity</th>
                                          <td>
                                            <p>60 LBS</p>
                                          </td>
                                        </tr>
                                        <tr class="width">
                                          <th>Width</th>
                                          <td>
                                            <p>24"</p>
                                          </td>
                                        </tr>
                                        <tr class="handle-height-ground-to-handle">
                                          <th>Handle height (ground to handle)</th>
                                          <td>
                                            <p>37-45"</p>
                                          </td>
                                        </tr>
                                        <tr class="wheels">
                                          <th>Wheels</th>
                                          <td>
                                            <p>12” air / wide track slick tread</p>
                                          </td>
                                        </tr>
                                        <tr class="seat-back-height">
                                          <th>Seat back height</th>
                                          <td>
                                            <p>21.5"</p>
                                          </td>
                                        </tr>
                                        <tr class="head-room">
                                          <th>Head room (inside canopy)</th>
                                          <td>
                                            <p>25"</p>
                                          </td>
                                        </tr>
                                        <tr class="pa_color">
                                          <th>Color</th>
                                          <td>
                                            <p>Black, Blue, Red, White</p>
                                          </td>
                                        </tr>
                                        <tr class="pa_size">
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
                                        <div class="form-group">
                                            <textarea class="form-control shadow" placeholder="Write a Review" name="review"></textarea>
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

                    <RelatedProducts/>

                </div>
            </section>
        </>
    )
}



export default ProductDetails