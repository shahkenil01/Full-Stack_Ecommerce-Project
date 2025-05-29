import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { fetchDataFromApi } from '../../utils/api';

const HomeCat = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi('/api/category/all').then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  }, []);

  return (
    <div className="container">
      <section className="homeCat">
        <div className="container">
          <h3 className="mb-3 hd">Featured Categories</h3>
          <Swiper slidesPerView={8} spaceBetween={8} navigation={false} slidesPerGroup={1}
            modules={[Navigation]} className="mySwiper4">
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <div className="item text-center cursor" style={{ backgroundColor: cat.color || '#f5f5f5' }}>
                  <img src={cat.images[0]} alt={cat.name} />
                </div>
                <h6>{cat.name}</h6>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default HomeCat;