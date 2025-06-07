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

const CustomNextArrow = ({ onClick, isDisabled, className }) => (
    <div
        className={`homeBanner-next-btn ${className} ${isDisabled ? "disabled" : ""}`}
        onClick={!isDisabled ? onClick : null}
    />
);

const CustomPrevArrow = ({ onClick, isDisabled, className }) => (
    <div
        className={`homeBanner-prev-btn ${className} ${isDisabled ? "disabled" : ""}`}
        onClick={!isDisabled ? onClick : null}
    />
);

const Home = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState(0);
    const [customProducts, setCustomProducts] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [swiperInstance, setSwiperInstance] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleSwiperUpdate = (swiper) => {
        if (!swiper) return;
        setIsBeginning(swiper.isBeginning);
        setIsEnd(swiper.isEnd);
    };

    const getCategoryProducts = (categoryName) => {
        const allowedNumbersByCategory = {
            "Fashion": [35, 36, 37, 38, 39, 40],
            "Electronics": [8, 9, 10, 11, 12],
            "Bags": [16, 17, 27, 47],
            "Footwear": [2, 6, 7, 19],
            "Groceries": [1, 3, 59],
            "Beauty": [25, 26, 54],
            "Wellness": [4, 5, 28, 29, 30],
            "Jewellery": [20]
        };

        const allowedNumbers = allowedNumbersByCategory[categoryName] || [];

        const numbered = products.map((item, index) => ({
            ...item,
            displayNumber: index + 1
        }));

        return allowedNumbers
            .map((num) =>
                numbered.find((item) =>
                    item.displayNumber === num && item.category?.name === categoryName
                )
            )
            .filter(Boolean);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const selectedCategory = categories[newValue]?.name;
        if (!selectedCategory) return;

        const filtered = getCategoryProducts(selectedCategory);
        setCategoryProducts(filtered);

        if (swiperInstance) {
            requestAnimationFrame(() => {
                swiperInstance.update();
            });
        }
    };

    useEffect(() => {
        fetchDataFromApi('/api/products').then(res => {
            if (Array.isArray(res)) {
                const numbered = res.map((item, index) => ({
                    ...item,
                    displayNumber: index + 1
                }));

                const allowedNumbers = [45, 22, 2, 5, 7, 10, 12, 14, 16, 18, 20, 24, 26, 28, 30];

                const filtered = allowedNumbers
                    .map((num) => numbered.find((item) => item.displayNumber === num))
                    .filter(Boolean);

                setProducts(res);
                setCustomProducts(filtered);
            }
        });
    }, []);

    useEffect(() => {
        const order = ["Fashion", "Electronics", "Bags", "Footwear", "Groceries", "Beauty", "Wellness", "Jewellery"];
        fetchDataFromApi('/api/category/all')
            .then(res => {
                if (Array.isArray(res)) {
                    const sorted = res.sort((a, b) =>
                        (order.indexOf(a.name.trim()) ?? 999) - (order.indexOf(b.name.trim()) ?? 999)
                    );
                    setCategories(sorted);
                } else {
                    console.error("Expected array from /api/category/all but got:", res);
                    setCategories([]);
                }
            });
    }, []);

    useEffect(() => {
        if (products.length > 0 && categories.length > 0) {
            const firstCategoryName = categories[0]?.name;
            const filtered = getCategoryProducts(firstCategoryName);
            setCategoryProducts(filtered);
        }
    }, [products, categories]);

    return (
        <>
            <HomeBanner />
            <HomeCat />

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
                            {/* Popular Products */}
                            <div className="info-1 d-flex align-item-center">
                                <div className="info">
                                    <h3 className="mb-0 hd">Popular Products</h3>
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of May.</p>
                                </div>
                                <Box sx={{ maxWidth: '100%', bgcolor: 'background.paper', overflow: 'hidden' }}>
                                    <Tabs
                                        value={value} onChange={handleChange} variant="scrollable"
                                        scrollButtons="auto" allowScrollButtonsMobile
                                        aria-label="scrollable category tabs"
                                        sx={{ minHeight: 48, "& .MuiTabs-scrollButtons": { color: "#000" } }}
                                    >
                                        {categories.map((cat, index) => (
                                            <Tab
                                                key={cat._id} label={cat.name} className="item"
                                                sx={{ minWidth: 95, maxWidth: 95, flexShrink: 0, textTransform: "capitalize", paddingX: 1 }}
                                            />
                                        ))}
                                    </Tabs>
                                </Box>
                            </div>

                            <div className="product_row w-100 mt-2">
                                <Swiper
                                    speed={500}
                                    slidesPerView={4}
                                    spaceBetween={10}
                                    navigation={{ nextEl: ".popular-products-next", prevEl: ".popular-products-prev" }}
                                    slidesPerGroup={2}
                                    pagination={{ clickable: true }}
                                    modules={[Navigation]}
                                    className="mySwiper"
                                    onSlideChange={(swiper) => handleSwiperUpdate(swiper)}
                                    onSwiper={(swiper) => {
                                        setSwiperInstance(swiper);
                                        requestAnimationFrame(() => {
                                            swiper.update();
                                            handleSwiperUpdate(swiper);
                                        });
                                    }}
                                >
                                    {Array.isArray(categoryProducts) &&
                                        categoryProducts.map((item) => (
                                            <SwiperSlide key={item._id}>
                                                <ProductItem item={item} />
                                            </SwiperSlide>
                                        ))}
                                </Swiper>

                                <CustomPrevArrow className="popular-products-prev" />
                                <CustomNextArrow className="popular-products-next" />
                            </div>

                            <div className="info-1 d-flex align-item-center mt-5">
                                <div className="info">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                            </div>

                            <div className="product_row productRow2 w-100 mt-3 d-flex flex-wrap">
                                {customProducts.map((product) => (
                                    <ProductItem item={product} key={product._id} />
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

                        <div className="info-1 d-flex align-item-center mt-4">
                            <div className="info m">
                                <h3 className="mb-0 hd">Recommended For You</h3>
                                <p className="text-light text-sml mb-0">Top picks based on your preferences.</p>
                            </div>
                        </div>
                        <div className="product_row w-100 mt-2 position-relative">
                            <div className="slider-wrapper">
                                <Swiper
                                    speed={500}
                                    slidesPerView={5.15}
                                    spaceBetween={10}
                                    navigation={{ nextEl: ".recommended-next", prevEl: ".recommended-prev" }}
                                    slidesPerGroup={3}
                                    modules={[Navigation]}
                                    className="mySwiper mt-2 w-100"
                                >
                                    {customProducts.slice(0, 8).map(item => (
                                        <SwiperSlide key={`rec-${item._id}`}>
                                            <ProductItem item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <CustomPrevArrow className="recommended-prev" />
                                <CustomNextArrow className="recommended-next" />
                            </div>
                        </div>

                        <div className="product_row w-100 mt-2 position-relative bannerSlider mt-2 mb-2">
                            <Swiper
                                slidesPerView={3}
                                spaceBetween={10}
                                navigation={{ nextEl: ".bannerSlide-next", prevEl: ".bannerSlide-prev" }}
                                slidesPerGroup={1}
                                modules={[Navigation]}
                                className="mySwiper"
                                breakpoints={{
                                    320: { slidesPerView: 1.2 },
                                    576: { slidesPerView: 2 },
                                    768: { slidesPerView: 2.5 },
                                    992: { slidesPerView: 3 },
                                }}
                            >
                                {[
                                    "https://api.spicezgold.com/download/file_1734525879105_banner-7.jpg",
                                    "https://api.spicezgold.com/download/file_1734525868575_banner-9.jpg",
                                    "https://api.spicezgold.com/download/file_1734525855497_banner-5.jpg"
                                ].map((url, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={url} alt={`Banner ${index + 1}`} className="w-100 rounded" />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <CustomPrevArrow className="bannerSlide-prev" />
                            <CustomNextArrow className="bannerSlide-next" />
                        </div>

                        <div className="info-1 d-flex align-item-center mt-3">
                            <div className="info m">
                                <h3 className="mb-0 hd">Top Rated Products</h3>
                                <p className="text-light text-sml mb-0">Highly rated by our customers.</p>
                            </div>
                        </div>
                        <div className="product_row w-100 mt-2 position-relative">
                            <div className="slider-wrapper">
                                <Swiper
                                    speed={500}
                                    slidesPerView={5.15}
                                    spaceBetween={10}
                                    navigation={{ nextEl: ".toprated-next", prevEl: ".toprated-prev" }}
                                    slidesPerGroup={3}
                                    modules={[Navigation]}
                                    className="mySwiper mt-2 w-100"
                                >
                                    {customProducts.slice(8, 16).map(item => (
                                        <SwiperSlide key={`top-${item._id}`}>
                                            <ProductItem item={item} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                                <CustomPrevArrow className="toprated-prev" />
                                <CustomNextArrow className="toprated-next" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
