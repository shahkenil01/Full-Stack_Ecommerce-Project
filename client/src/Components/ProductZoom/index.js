import Slider from "react-slick";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef } from 'react';

const ProductZoom = ({ images = [], price, oldPrice }) => {
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        if (zoomSlider.current?.slickGoTo) zoomSlider.current.slickGoTo(index);
        if (zoomSliderBig.current?.slickGoTo) zoomSliderBig.current.slickGoTo(index);
    };

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
    };

    const settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const hasDiscount = oldPrice && oldPrice > price;
    const discountPercent = hasDiscount
        ? Math.round(((oldPrice - price) / oldPrice) * 100)
        : 0;

    if (!images || images.length === 0) return null;

    return (
        <div className="productZoom">
            <div className='productZoom position-relative'>
                {hasDiscount && (
                    <div className='badge badge-primary'>
                        -{discountPercent}%
                    </div>
                )}
                <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>
                    {images.map((img, i) => (
                        <div className='item' key={i}>
                            <InnerImageZoom zoomType="hover" zoomScale={1} src={img} alt={`Product Image ${i + 1}`} />
                        </div>
                    ))}
                </Slider>
            </div>

            <Slider {...settings} className='zoomSlider' ref={zoomSlider}>
                {images.map((img, i) => (
                    <div className='item' key={i}>
                        <img src={img} className='w-100' onClick={() => goto(i)} alt={`Thumbnail ${i + 1}`} />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ProductZoom;