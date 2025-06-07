import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { TfiFullscreen } from "react-icons/tfi";
import { IoMdHeartEmpty } from "react-icons/io";
import Button from "@mui/material/Button";
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';

const ProductItem = ({ item, itemView }) => {
  const { setIsOpenProductModal, setSelectedProduct } = useContext(MyContext);

  const image = item?.images?.[0] || "https://via.placeholder.com/300";
  const inStock = item?.countInStock > 0;
  const rating = item?.rating || 0;
  const price = item?.price || 0;
  const oldPrice = item?.oldPrice || '';
  const name = item?.name || 'Unnamed Product';
  const id = item?._id;

  return (
    <div className={`productItem ${itemView}`}>

      <div className="imgWrapper">
        <Link to={`/product/${id}`}>
          <img src={image} className="w-100" alt={name} />
          {item?.images?.[1] && (
            <img className="w-100 hover-img" src={item.images[1]} alt="hover"/>
          )}
        </Link>
        {oldPrice && price && (
          (() => {
            const cleanOld = parseFloat(String(oldPrice).replace(/,/g, ''));
            const cleanPrice = parseFloat(String(price).replace(/,/g, ''));
            if (!isNaN(cleanOld) && !isNaN(cleanPrice) && cleanOld > cleanPrice) {
              const percent = Math.round(((cleanOld - cleanPrice) / cleanOld) * 100);
              return <span className="badge badge-primary">{percent}%</span>;
            }
            return null;
          })()
        )}
        <div className="actions">
          <Button onClick={() => { setSelectedProduct(item); setIsOpenProductModal(true); }}>
            <TfiFullscreen />
          </Button>
          <Button>
            <IoMdHeartEmpty style={{ fontSize: '20px' }} />
          </Button>
        </div>
      </div>

      <div className="info">
        <Link to={`/product/${id}`}>
          <h4>{name}</h4>
        </Link>
        <span className={`d-block ${inStock ? 'text-success' : 'text-danger'}`}>
          {inStock ? 'In Stock' : 'Out of Stock'}
        </span>
        <Rating className="mt-1 mb-1" name="read-only" value={rating} readOnly size="small" precision={0.5} />
        <div className="d-flex">
          {oldPrice && <span className="oldPrice">₹{oldPrice}</span>}
          <span className="netPrice text-danger ml-2">₹{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
