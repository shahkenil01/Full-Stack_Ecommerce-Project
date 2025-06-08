import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from '../../../Components/ProductItem';
import { fetchDataFromApi } from '../../../utils/api';

const RelatedProducts = ({ subcategoryId, categoryId, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchDataFromApi('/api/products').then((res) => {
      if (!Array.isArray(res)) return;

      let filtered = [];

      if (subcategoryId) {
        filtered = res.filter(
          (p) =>
            (p.subcategory?._id || p.subcategory) === subcategoryId &&
            p._id !== currentProductId
        );
      }

      if ((!subcategoryId || filtered.length === 0) && categoryId) {
        filtered = res.filter(
          (p) =>
            (p.category?._id || p.category) === categoryId &&
            p._id !== currentProductId
        );
      }

      setProducts(filtered);
    });
  }, [subcategoryId, categoryId]);

  const handleSwiperUpdate = (swiper) => {
    const prevBtn = document.querySelector('.related-products-prev-btn');
    const nextBtn = document.querySelector('.related-products-next-btn');
    if (prevBtn && nextBtn) {
      prevBtn.classList.toggle('disabled', swiper.isBeginning);
      nextBtn.classList.toggle('disabled', swiper.isEnd);
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="container">
      <div className="d-flex align-item-center mt-3 ml-2">
        <div className="info">
          <h3 className="mb-0 hd">Related Products</h3>
        </div>
      </div>

      <div className="related-products-container w-100 mt-3">
        <Swiper
          slidesPerView={5}
          spaceBetween={10}
          navigation={{
            nextEl: '.related-products-next-btn',
            prevEl: '.related-products-prev-btn',
          }}
          slidesPerGroup={4}
          pagination={{ clickable: true }}
          modules={[Navigation]}
          className="mySwiper"
          onSlideChange={handleSwiperUpdate}
          onSwiper={handleSwiperUpdate}
        >
          <div className="related-products-prev-btn"></div>

          {products.map((item) => (
            <SwiperSlide className="related-product-slide" key={item._id}>
              <ProductItem item={item} />
            </SwiperSlide>
          ))}

          <div className="related-products-next-btn"></div>
        </Swiper>
      </div>
    </div>
  );
};

export default RelatedProducts;
