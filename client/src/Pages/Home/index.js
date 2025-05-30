import React, { useEffect, useState } from "react";
import HomeBanner from "../../Components/HomeBanner";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import images from '../../assets/images.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { fetchDataFromApi } from '../../utils/api';

import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const CustomNextArrow = ({ onClick, isDisabled }) => (
    <div
        className={`homeBanner-next-btn popular-products-next ${isDisabled ? "disabled" : ""}`}
        onClick={!isDisabled ? onClick : null}
    />
);

const CustomPrevArrow = ({ onClick, isDisabled }) => (
    <div
        className={`homeBanner-prev-btn popular-products-prev ${isDisabled ? "disabled" : ""}`}
        onClick={!isDisabled ? onClick : null}
    />
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => setValue(newValue);

    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const handleSwiperUpdate = (swiper) => {
        if (!swiper) return;
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    useEffect(() => {
        fetchDataFromApi('/api/products').then(res => {
            if (Array.isArray(res)) {
                setProducts(res);
            }
        });
    }, []);

    useEffect(() => {
        const order = ["Fashion", "Electronics", "Bags", "Footwear", "Groceries", "Beauty", "Wellness", "Jewellery"];
        fetchDataFromApi('/api/category/all')
            .then(res => res && setCategories(res.sort((a, b) =>
                (order.indexOf(a.name.trim()) ?? 999) - (order.indexOf(b.name.trim()) ?? 999)
            )));
    }, []);

    return (
        <>
            <HomeBanner />
            <HomeCat/>
            
            <section className="homeProducts">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="sticky">
                                <div className="banner">
                                    <img src={images.banner1} className="cursor w-100" alt="Banner" />
                                </div>
                                <div className="banner mt-4">
                                    <img src={images.banner2} className="cursor w-100" alt="Banner" />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-9 productRow">
                            <div className="info-1 d-flex align-item-center">
                                <div className="info">
                                    <h3 className="mb-0 hd">Popular Products</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of May.</p>
                                </div>
                                <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper', overflow: 'hidden' }} >
                                    <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto"
                                    allowScrollButtonsMobile aria-label="scrollable category tabs" 
                                    sx={{  minHeight: 48, "& .MuiTabs-scrollButtons": { color: "#000" }}}>
                                        {categories.map((cat, index) => (
                                            <Tab key={cat._id} label={cat.name} className="item" 
                                            sx={{ minWidth: 95,  maxWidth: 95, flexShrink: 0, textTransform: "capitalize", paddingX: 1 }}/>
                                        ))}
                                    </Tabs>
                                </Box>
                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={{ nextEl: ".popular-products-next", prevEl: ".popular-products-prev" }}
                                    slidesPerGroup={2}
                                    pagination={{ clickable: true }}
                                    modules={[Navigation]}
                                    className="mySwiper"
                                    onSlideChange={(swiper) => handleSwiperUpdate(swiper)}
                                    onSwiper={(swiper) => { setSwiperInstance(swiper); requestAnimationFrame(() => { swiper.update();
                                        handleSwiperUpdate(swiper); }); }}
                                >
                                    {products.map((item) => (
                                        <SwiperSlide key={item._id}>
                                            <ProductItem item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>

                                <CustomPrevArrow />
                                <CustomNextArrow />
                            </div>

                            <div className="info-1 d-flex align-item-center mt-5">
                                <div className="info">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                            </div>

                            <div className="product_row productRow2 w-100 mt-3 d-flex flex-wrap">
                                {products.map((item) => (
                                    <ProductItem item={item} key={item._id} />
                                ))}
                            </div>

                            <div className="d-flex mt-4 mb-2 bannerSec">
                                <div className="banner">
                                    <img src={images.banner3} className="cursor w-100" alt="Banner" />
                                </div>

                                <div className="banner">
                                    <img src={images.banner4} className="cursor w-100" alt="Banner" />
                                </div>

                                <div className="banner">
                                    <img src={images.banner5} className="cursor w-100" alt="Banner" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
