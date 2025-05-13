import React from "react";
import Slider from "react-slick";
import images from '../../assets/images';

const homeBanner = ()=>{
           const NextArrow = (props) => {
                const { onClick } = props;
                return <div className="homeBanner-next-btn" onClick={onClick} />;
            }
            
            const PrevArrow = (props) => {
                const { onClick } = props;
                return <div className="homeBanner-prev-btn" onClick={onClick} />;
            };

    var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        centerMode: true,
        centerPadding: '40px',
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />
      };

    return (
        <div className="container mt-3">
            <div className="homeBannerSection">
                <Slider {...settings}>
                <div className="item">
                    <img src={images.slider1} className="w-100" alt="Slider 1"/>
                </div>
                <div className="item">
                    <img src={images.slider2} className="w-100" alt="Slider 2"/>
                </div>
                <div className="item">
                    <img src={images.slider3} className="w-100" alt="Slider 3"/>
                </div>
                <div className="item">
                    <img src={images.slider4} className="w-100" alt="Slider 4"/>
                </div>
                <div className="item">
                    <img src={images.slider5} className="w-100" alt="Slider 5"/>
                </div>
                <div className="item">
                    <img src={images.slider6} className="w-100" alt="Slider 6"/>
                </div>
                <div className="item">
                    <img src={images.slider7} className="w-100" alt="Slider 7"/>
                </div>
                <div className="item">
                    <img src={images.slider8} className="w-100" alt="Slider 8"/>
                </div>
                </Slider>
            </div>
        </div>
    )
}

export default homeBanner;