import Rating from '@mui/material/Rating';
import { TfiFullscreen } from "react-icons/tfi";
import Button from "@mui/material/Button";
import { IoMdHeartEmpty } from "react-icons/io";
import { useContext } from 'react';
import { MyContext } from '../../App';
import { Link } from 'react-router-dom';

const ProductItem = ({ item }) => {
  const { setIsOpenProductModal } = useContext(MyContext);

  const image = item?.images?.[0] || "https://via.placeholder.com/300";
  const inStock = item?.countInStock > 0;
  const rating = item?.rating || 0;
  const price = item?.price || 0;
  const oldPrice = item?.oldPrice || '';
  const name = item?.name || 'Unnamed Product';
  const id = item?._id;

  return (
    <div className={`productItem`}>
      <Link to={`/product/${id}`} className="fullLink"></Link>

      <div className="imgWrapper">
        <Link to={`/product/${id}`}>
          <img src={image} className="w-100" alt={name} />
        </Link>
        {oldPrice && oldPrice > price && (
          <span className="badge badge-primary">
            -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
          </span>
        )}
        <div className="actions">
          <Button onClick={() => setIsOpenProductModal(true)}>
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
        <Rating
          className="mt-1 mb-1"
          name="read-only"
          value={rating}
          readOnly
          size="small"
          precision={0.5}
        />
        <div className="d-flex">
          {oldPrice && <span className="oldPrice">₹{oldPrice}</span>}
          <span className="netPrice text-danger ml-2">₹{price}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
