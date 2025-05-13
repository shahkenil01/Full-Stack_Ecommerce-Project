import Slider from "react-slick";
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import { useRef } from 'react';

const ProductZoom = () =>{
    const zoomSliderBig = useRef();
    const zoomSlider = useRef();

    const goto = (index) => {
        if (zoomSlider.current && zoomSlider.current.slickGoTo) {
            zoomSlider.current.slickGoTo(index);
        }
        if (zoomSliderBig.current && zoomSliderBig.current.slickGoTo) {
            zoomSliderBig.current.slickGoTo(index);
        }
    };

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        fade: false,
        arrows: true
    };

    var settings2 = {
        dots: false,
        infinite: false,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: false,
        arrows: false,
        beforeChange: (current, next) => console.log("Slide change: ", next),
        afterChange: (current) => console.log("Current slide: ", current)
    };

    return(
        <div className="productZoom">
                    <div className='productZoom position-relative'>
                        <div className='badge badge-primary'>-50%</div>
                        <Slider {...settings2} className='zoomSliderBig' ref={zoomSliderBig}>
                            <div className='item'>
                                <InnerImageZoom zoomType="hover" zoomScale={1} src={'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg'} alt="Product Modal Image" />
                            </div>
                            <div className='item'>
                                <InnerImageZoom zoomType="hover" zoomScale={1} src={'https://api.spicezgold.com/download/file_1734690981297_23990e6b-d01e-40fd-bb6b-98198db544c01714702040162RARERABBITMenComfortOpaqueCasualShirt2.jpg'} alt="Product Modal Image" />
                            </div>
                            <div className='item'>
                                 <InnerImageZoom zoomType="hover" zoomScale={1} src={'https://api.spicezgold.com/download/file_1734690981299_c56f7a00-e9c5-43dc-8288-190cfc0fef3e1714702040062RARERABBITMenComfortOpaqueCasualShirt3.jpg'} alt="Product Modal Image" />
                            </div>
                        </Slider>
                    </div>
                    <Slider {...settings} className='zoomSlider' ref={zoomSlider}>
                        <div className='item'>
                            <img src={'https://api.spicezgold.com/download/file_1734690981297_011618e4-4682-4123-be80-1fb7737d34ad1714702040213RARERABBITMenComfortOpaqueCasualShirt1.jpg'} className='w-100' onClick={() => goto(0)} alt="Product Modal Small Image" />
                        </div>
                        <div className='item'>
                            <img src={'https://api.spicezgold.com/download/file_1734690981297_23990e6b-d01e-40fd-bb6b-98198db544c01714702040162RARERABBITMenComfortOpaqueCasualShirt2.jpg'} className='w-100' onClick={() => goto(1)} alt="Product Modal Small Image" />
                        </div>
                        <div className='item'>
                            <img src={'https://api.spicezgold.com/download/file_1734690981299_c56f7a00-e9c5-43dc-8288-190cfc0fef3e1714702040062RARERABBITMenComfortOpaqueCasualShirt3.jpg'} className='w-100' onClick={() => goto(2)} alt="Product Modal Small Image" />
                        </div>
                    </Slider>
                </div>
    )
}

export default ProductZoom;