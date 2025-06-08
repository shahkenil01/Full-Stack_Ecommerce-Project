import { useState, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import { MdClose } from "react-icons/md";
import Rating from '@mui/material/Rating';
import QuantityBox from '../QuantityBox';
import { IoIosHeartEmpty } from "react-icons/io";
import { MdOutlineCompareArrows } from "react-icons/md";
import ProductZoom from '../ProductZoom';
import { BsCartFill } from "react-icons/bs";
import { MyContext } from '../../App';

const ProductModel = ({ isOpen, closeProductModal }) => {

    const { selectedProduct } = useContext(MyContext);
    const [activeOption, setActiveOption] = useState(null);

    if (!selectedProduct) return null;

    const { name, brand, price, oldPrice, images, rating, countInStock, description } = selectedProduct;

    return (
        <Dialog open={isOpen} className="productModal" onClose={closeProductModal}>
            <Button className='close_' onClick={closeProductModal}><MdClose /></Button>
            <h4 className="mb-1 font-weight-bold">{name}</h4>
            <div className='d-flex align-items-center'>
                <div className='d-flex align-items-center mr-4'>
                    <span>Brands:</span>
                    <span className='ml-2'><b>{brand}</b></span>
                </div>
                <Rating name="read-only" value={rating || 0} size="small" precision={0.5} readOnly />
            </div>
            <hr />
            <div className='row mt-2 productDetailModal'>
                
                <div className='col-md-5'>
                    <ProductZoom images={images} price={price} oldPrice={oldPrice} />
                </div>
                <div className='col-md-7'>
                        <div className='d-flex info align-items-center mb-3'>
                            <span className='oldPrice lg mr-2'>Rs: {oldPrice}</span>
                            <span className="netPrice lg text-danger">Rs: {price}</span>
                        </div>
                        <span className={`badge ${countInStock > 0 ? 'bg-success' : 'bg-danger'}`}>
                            {countInStock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                        </span>
                        <p className='mt-3'>{description}</p>
                        {(selectedProduct.productRAMS?.length > 0 || selectedProduct.productSIZE?.length > 0 || selectedProduct.productWEIGHT?.length > 0) && (
                            <>
                                {selectedProduct.productRAMS?.length > 0 && (
                                    <div className="productSize d-flex align-items-center mt-4">
                                        <span className="mr-2">RAM:</span>
                                        <ul className="list list-inline mb-0 pl-4">
                                            {selectedProduct.productRAMS.map((ram, idx) => (
                                                <li className='list-inline-item' key={`ram-${idx}`}>
                                                    <a className={`tag ${activeOption === `ram-${idx}` ? 'active' : ''}`}
                                                        onClick={() => setActiveOption(`ram-${idx}`)}>{ram}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedProduct.productSIZE?.length > 0 && (
                                    <div className="productSize d-flex align-items-center mt-4">
                                        <span className="mr-2">Size:</span>
                                        <ul className="list list-inline mb-0 pl-4">
                                            {selectedProduct.productSIZE.map((size, idx) => (
                                                <li className='list-inline-item' key={`size-${idx}`}>
                                                    <a className={`tag ${activeOption === `size-${idx}` ? 'active' : ''}`}
                                                        onClick={() => setActiveOption(`size-${idx}`)}>{size}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedProduct.productWEIGHT?.length > 0 && (
                                    <div className="productSize d-flex align-items-center mt-4">
                                        <span className="mr-2">Weight:</span>
                                        <ul className="list list-inline mb-0 pl-4">
                                            {selectedProduct.productWEIGHT.map((weight, idx) => (
                                                <li className='list-inline-item' key={`weight-${idx}`}>
                                                    <a className={`tag ${activeOption === `weight-${idx}` ? 'active' : ''}`}
                                                        onClick={() => setActiveOption(`weight-${idx}`)}>{weight}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                        <div className='d-flex align-items-center'>
                            <QuantityBox/>
                            <Button className='btn-blue btn-lg btn-big bg-red btn-round ml-3'><BsCartFill/>&nbsp;Add to Cart</Button>
                        </div>
                        <div className='d-flex align-items-center mt-5 actions'>
                            <Button className='btn-round btn-sml' variant="outlined"> <IoIosHeartEmpty /> &nbsp; ADD TO WISHLIST</Button>
                            <Button className='btn-round btn-sml ml-3' variant="outlined"> <MdOutlineCompareArrows/> &nbsp; COMARE</Button>
                        </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModel;
