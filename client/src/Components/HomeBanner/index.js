import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { fetchDataFromApi } from "../../utils/api";
import images from "../../assets/images"; // Make sure bannerAlt is exported from there

const HomeBanner = () => {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/homeBanner").then((res) => {
      if (Array.isArray(res) && res.length > 0) {
        setSlides(res);
      }
    });
  }, []);

  const NextArrow = ({ onClick }) => <div className="homeBanner-next-btn" onClick={onClick} />;
  const PrevArrow = ({ onClick }) => <div className="homeBanner-prev-btn" onClick={onClick} />;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: slides.length > 1, // ❗️ Show arrows only if more than one slide
    centerMode: true,
    centerPadding: "40px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="container mt-3">
      <div className="homeBannerSection">
        {slides.length > 0 ? (
          <Slider {...settings}>
            {slides.map((slide, index) => (
              <div className="item" key={index}>
                <img src={slide.image} className="w-100" alt={`Slide ${index + 1}`} />
              </div>
            ))}
          </Slider>
        ) : (
          <div className="item">
            <img src={images.bannerAlt} className="w-100" alt="Default Banner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
