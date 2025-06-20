import { useEffect, useState, useContext, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Rating from '@mui/material/Rating';
import { IoIosHeartEmpty } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { BsCartFill } from "react-icons/bs";
import QuantityBox from '../QuantityBox';
import ProductZoom from '../ProductZoom';
import { MyContext } from '../../App';
import { useSnackbar } from "notistack";

const ProductModel = ({ isOpen, closeProductModal }) => {
    const { selectedProduct, cartItems, addToCart } = useContext(MyContext);
    const [activeOption, setActiveOption] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [showSelectionError, setShowSelectionError] = useState(false);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const toastRef = useRef(null);

    if (!selectedProduct) return null;

    const { name, brand, price, oldPrice, images, rating, countInStock, description, _id: productId } = selectedProduct;

    const handleAddToCart = async () => {
        const hasOptions =
            selectedProduct.productRAMS?.length > 0 ||
            selectedProduct.productSIZE?.length > 0 ||
            selectedProduct.productWEIGHT?.length > 0;

        if (hasOptions && !activeOption) {
            setShowSelectionError(true);
            return;
        }

        setShowSelectionError(false);
        setAdding(true);

        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const userEmail = userInfo?.email;

        const cartData = {
            productTitle: name,
            image: images?.[0] || '',
            rating: rating || "0",
            price: price,
            quantity: quantity,
            subTotal: price * quantity,
            productId: productId,
            userEmail: userEmail,
        };

        try {
            const existingItem = cartItems.find(
                item => item.productId === productId || item._id === productId
            );

            if (existingItem) {
                const updatedQty = existingItem.quantity + quantity;

                await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/${existingItem.cartId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        quantity: updatedQty,
                        subTotal: updatedQty * price,
                    }),
                });

                addToCart({ ...selectedProduct, cartId: existingItem.cartId, productId }, quantity);
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

                addToCart({ ...selectedProduct, quantity, cartId: savedItem._id, productId }, quantity);
                enqueueSnackbar("Item added to cart", { variant: "success" });
            }
        } catch (err) {
            enqueueSnackbar("DB error: " + err.message, { variant: "error" });
        } finally {
            setAdding(false);
        }
    };

    const handleAddToFavorite = async () => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (!userInfo?.email) {
            enqueueSnackbar("Please login to use wishlist", { variant: "warning" });
            return;
        }

        const favData = {
            productId: selectedProduct._id,
            userEmail: userInfo.email,
            name: selectedProduct.name,
            image: selectedProduct.images?.[0] || '',
            rating: selectedProduct.rating || 0,
            price: selectedProduct.price,
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
                    body: JSON.stringify({ productId: selectedProduct._id, userEmail: userInfo.email }),
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

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo?.email && selectedProduct?._id) {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/favorite/user/${userInfo.email}`)
                .then(res => res.json())
                .then(data => {
                    const match = data.find(item => item.productId === selectedProduct._id);
                    setIsFavorite(!!match);
                });
        } 
    }, [selectedProduct]);

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
                                    <ul className={`list list-inline mb-0 pl-4 ${showSelectionError && !activeOption ? 'error' : ''}`}>
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
                                    <ul className={`list list-inline mb-0 pl-4 ${showSelectionError && !activeOption ? 'error' : ''}`}>
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
                                    <ul className={`list list-inline mb-0 pl-4 ${showSelectionError && !activeOption ? 'error' : ''}`}>
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

                    <div className='d-flex align-items-center mt-3'>
                        <QuantityBox quantity={quantity} setQuantity={setQuantity} />
                        <Button className='btn-blue btn-lg btn-big bg-red btn-round ml-3' onClick={handleAddToCart} disabled={adding}>
                            <BsCartFill />&nbsp;{adding ? "Adding..." : "Add to Cart"}
                        </Button>
                    </div>

                    <div className='d-flex align-items-center mt-4 actions'>
                        <Tooltip title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"} placement="top">
                            <Button className='btn-round btn-sml' variant="outlined" onClick={handleAddToFavorite}>
                                {isFavorite ? <FaHeart className="text-danger" /> : <IoIosHeartEmpty />}
                                &nbsp; {isFavorite ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Dialog>
    );
};

export default ProductModel;
