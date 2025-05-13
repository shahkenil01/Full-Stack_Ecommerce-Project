import HomeBanner from "../../Components/HomeBanner";
import ProductItem from "../../Components/ProductItem";
import HomeCat from "../../Components/HomeCat";
import images from '../../assets/images.js';
import Button from '@mui/material/Button';
import { IoIosArrowRoundForward } from "react-icons/io";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CustomNextArrow = ({ onClick, isDisabled }) => (
    <div className={`homeBanner-next-btn popular-products-next ${isDisabled ? "disabled" : ""}`} onClick={!isDisabled ? onClick : null} />
);

const CustomPrevArrow = ({onClick, isDisabled }) => (
    <div className={`homeBanner-prev-btn popular-products-prev ${isDisabled ? "disabled" : ""}`} onClick={!isDisabled ? onClick : null} />
);

const handleSwiperUpdate = (swiper) => {
    document.querySelector(".popular-products-prev").classList.toggle("disabled", swiper.isBeginning);
    document.querySelector(".popular-products-next").classList.toggle("disabled", swiper.isEnd);
};

const Home = () => {

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
                                    <p className="text-light text-sml mb-0">Do not miss the current offers until the end of Feb.</p>
                                </div>
                                <Button className="viewAllBtn ml-auto">View All<IoIosArrowRoundForward /></Button>
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
                                    onSwiper={(swiper) => handleSwiperUpdate(swiper)}
                                >
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                    <SwiperSlide><ProductItem /></SwiperSlide>
                                </Swiper>

                                <CustomPrevArrow />
                                <CustomNextArrow />
                            </div>

                            <div className="info-1 d-flex align-item-center mt-5">
                                <div className="info">
                                    <h3 className="mb-0 hd">NEW PRODUCTS</h3>
                                    <p className="text-light text-sml mb-0">New products with updated stocks.</p>
                                </div>
                                <Button className="viewAllBtn ml-auto">View All<IoIosArrowRoundForward /></Button>
                            </div>

                            <div className="product_row productRow2 w-100 mt-3 d-flex">
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
                                <ProductItem />
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
