import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button";
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext } from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const ProductItem = (props) => {
    const { setIsOpenProductModal } = useContext(MyContext);
    
    return (
        <>
            <div className={`productItem ${props.itemView}`}>
            <Link to="/product/1" className="fullLink"></Link>
                <div className="imgWrapper"><Link to="/product/1">
                    <img src="https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg" className="w-100" alt='Product'/></Link>
                    <span className="badge badge-primary">-50%</span>
                    <div className="actions">
                        <Button onClick={() => setIsOpenProductModal(true)}><TfiFullscreen /></Button>
                        <Button><IoMdHeartEmpty style={{ fontSize: '20px' }} /></Button>
                    </div>
                </div>
                <div className="info"><Link to="/product/1">
                    <h4>Men Alias-N Regular Fit Spread Collar Shirt</h4></Link>
                    <span className="text-success d-block">In Stock</span>
                    <Rating className="mt-1 mb-1" name="read-only" value={4.5} readOnly size="small" precision={0.5} />
                    <div className="d-flex">
                        <span className="oldPrice">₹1000</span>
                        <span className="netPrice text-danger ml-2">₹500</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductItem;
