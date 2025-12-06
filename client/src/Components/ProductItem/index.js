import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TfiFullscreen } from 'react-icons/tfi';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { MyContext } from '../../App';
import { useSnackbar } from 'notistack';

const ProductItem = ({ item, itemView }) => {
  const { setIsOpenProductModal, setSelectedProduct } = useContext(MyContext);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isFavorite, setIsFavorite] = useState(false);
  const toastRef = useRef(null);

  const image = item?.images?.[0] || 'https://via.placeholder.com/300';
  const inStock = item?.countInStock > 0;
  const rating = item?.rating || 0;
  const price = item?.price || 0;
  const oldPrice = item?.oldPrice || '';
  const name = item?.name || 'Unnamed Product';
  const id = item?._id;

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");
    if (!userInfo?.email || !id) return;

    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/favorite/user/${encodeURIComponent(
            userInfo.email
          )}`
        );
        if (!res.ok) return;
        const data = await res.json();

        const exists = data.some((fav) => {
          if (typeof fav.productId === "string") {
            return fav.productId === id;
          }
          if (fav.productId && fav.productId._id) {
            return fav.productId._id === id;
          }
          return false;
        });

        setIsFavorite(exists);
      } catch (err) {
        console.error("Error checking favourite status", err);
      }
    };

    fetchFavoriteStatus();
  }, [id]);

  useEffect(() => {
    if (item?.isFavorite) {
      setIsFavorite(true);
    }
  }, [item]);

  const handleOpenModal = () => {
    setSelectedProduct(item);
    setIsOpenProductModal(true);
  };

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');

    if (!userInfo?.email) {
      enqueueSnackbar('Please login to add favourites', { variant: 'info' });
      return;
    }

    const favData = {
      productId: id,
      userEmail: userInfo.email,
      name,
      image,
      rating,
      price,
    };

    try {
      if (toastRef.current) {
        closeSnackbar(toastRef.current);
      }

      let res;
      let msg = '';

      if (isFavorite) {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/favorite/remove`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: id,
              userEmail: userInfo.email,
            }),
          },
        );
        msg = 'Removed from favourites';
      } else {
        res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/favorite/add`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(favData),
          },
        );
        msg = 'Added to favourites';
      }
      if (!res.ok) {
        throw new Error('Request failed');
      }
      const key = enqueueSnackbar(msg, { variant: 'success' });
      toastRef.current = key;
      setIsFavorite(!isFavorite);
    } catch (error) {
      enqueueSnackbar('Error updating favourites', { variant: 'error' });
    }
  };

  return (
    <div className={`productItem ${itemView}`}>
      <div className="imgWrapper">
        <Link to={`/product/${id}`}>
          <img src={image} className="w-100" alt={name} />
          {item?.images?.[1] && (
            <img className="w-100 hover-img" src={item.images[1]} alt="hover" />
          )}
        </Link>
        {oldPrice &&
          price &&
          (() => {
            const cleanOld = parseFloat(String(oldPrice).replace(/,/g, ''));
            const cleanPrice = parseFloat(String(price).replace(/,/g, ''));
            if (
              !isNaN(cleanOld) &&
              !isNaN(cleanPrice) &&
              cleanOld > cleanPrice
            ) {
              const percent = Math.round(
                ((cleanOld - cleanPrice) / cleanOld) * 100,
              );
              return <span className="badge badge-primary">{percent}%</span>;
            }
            return null;
          })()}
        <div className="actions">
          <Button onClick={handleOpenModal}>
            <TfiFullscreen />
          </Button>
          <Button onClick={handleFavoriteClick}>
            {isFavorite ? (
              <IoMdHeart style={{ fontSize: '20px', color: 'red' }} />
            ) : (
              <IoMdHeartEmpty style={{ fontSize: '20px' }} />
            )}
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
