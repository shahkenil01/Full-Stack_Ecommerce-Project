import React, { useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import images from '../../assets/images';

const HomeCat = () => {

    return (
        <div className="container">
            <section className="homeCat">
            <div className="container">
                <h3 class="mb-3 hd">Featured Categories</h3>
                <Swiper
                    slidesPerView={8}
                    spaceBetween={8}
                    navigation={false}
                    slidesPerGroup={1}
                    modules={[Navigation]}
                    className="mySwiper4"
                > 
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#f8ffe8'}}>
                            <img src={images.Fashion}/>
                        </div><h6>Fashion</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#e7fae8'}}>
                            <img src={images.Electronics} />
                        </div><h6>Electronics</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#fdebea'}}>
                            <img src={images.Bags} /> 
                        </div><h6>Bags</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#e5f1ff'}}>
                            <img src={images.Footwear} />
                        </div><h6>Footwear</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#fbe7fb'}}>
                            <img src={images.Groceries} />
                        </div><h6>Groceries</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#e7fdfb'}}>
                            <img src={images.Beauty} />
                        </div><h6>Beauty</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#fdeef5'}}>
                            <img src={images.Wellness} />
                        </div><h6>Wellness</h6>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="item text-center cursor" style={{backgroundColor: '#fff6e5'}}>
                            <img src={images.Jewellery} />
                        </div><h6>Jewellery </h6>
                    </SwiperSlide>
                    
                </Swiper>
            </div>
        </section>
        </div>
    )
}

export default HomeCat;



{/*import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const HomeCat = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch data from the backend
        fetch('/api/categories')  // Replace with your actual API endpoint
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    }, []);

    return (
        <div className="container">
            <section className="homeCat">
                <div className="container">
                    <h3 className="mb-3 hd">Featured Categories</h3>
                    <Swiper
                        slidesPerView={8}
                        spaceBetween={8}
                        navigation={false}
                        slidesPerGroup={1}
                        modules={[Navigation]}
                        className="mySwiper4"
                    > 
                        {categories.map((category) => (
                            <SwiperSlide key={category._id}>
                                <div className="item text-center cursor" style={{backgroundColor: category.color}}>
                                    <img src={category.images[0]} alt={category.name} />
                                </div>
                                <h6>{category.name}</h6>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>
        </div>
    );
};

export default HomeCat;*/}
