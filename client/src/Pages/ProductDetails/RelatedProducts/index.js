import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import ProductItem from '../../../Components/ProductItem';

const RelatedProducts = (props) => {
  const handleSwiperUpdate = (swiper) => {
    const prevBtn = document.querySelector('.related-products-prev-btn');
    const nextBtn = document.querySelector('.related-products-next-btn');

    if (prevBtn && nextBtn) {
        prevBtn.classList.toggle('disabled', swiper.isBeginning);
        nextBtn.classList.toggle('disabled', swiper.isEnd);
    }
};


  return (
    <>
      <div className="container">
        <div className="d-flex align-item-center mt-3 ml-2">
          <div className="info">
            <h3 className="mb-0 hd">{props.title}</h3>
            
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
            slidesPerGroup={1}
            pagination={{ clickable: true }}
            modules={[Navigation]}
            className="mySwiper"
            onSlideChange={(swiper) => handleSwiperUpdate(swiper)}
            onSwiper={(swiper) => handleSwiperUpdate(swiper)}
          >
            <div className="related-products-prev-btn"></div>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <SwiperSlide className="related-product-slide">
              <ProductItem />
            </SwiperSlide>
            <div className="related-products-next-btn"></div>
          </Swiper>
          
            
          </div>
        </div>
    </>
  );
};

export default RelatedProducts;
