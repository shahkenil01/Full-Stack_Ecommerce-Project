import React, { useRef } from "react";
import { Breadcrumbs, Typography, Link as MuiLink, Button, Rating } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import Slider from "react-slick";
import { MdBrandingWatermark } from "react-icons/md";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { FaPalette } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import { FaTag } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa"	;
import { FaStar } from "react-icons/fa";
import { FaShieldAlt } from "react-icons/fa";
import { FaReply } from "react-icons/fa";
import UserAvatarImgComponent from "../../components/userAvatarImg";

const ProductDetails = () => {

  const bigSliderRef = useRef(null);
  const smallSliderRef = useRef(null);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const productSliderOptions = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    ref: bigSliderRef,
    afterChange: (index) => {
      setActiveIndex(index);
      if (smallSliderRef.current) {
        smallSliderRef.current.slickGoTo(index);
      }
    }
  };

  const productSliderSmlOptions = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleThumbnailClick = (index) => {
    if (bigSliderRef.current) {
      bigSliderRef.current.slickGoTo(index);
    }
  };

  const imageUrls = [
    "https://mironcoder-hotash.netlify.app/images/product/single/01.webp",
    "https://mironcoder-hotash.netlify.app/images/product/single/02.webp",
    "https://mironcoder-hotash.netlify.app/images/product/single/03.webp",
    "https://mironcoder-hotash.netlify.app/images/product/single/04.webp",
    "https://mironcoder-hotash.netlify.app/images/product/single/05.webp"
  ];

  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Product View</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link">
            Products
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Product View
          </Typography>
        </Breadcrumbs>
      </div>

      <div className="card productDetailsSEction">
        <div className="row">
          <div className="col-md-5">
            <div className="sliderWrapper pt-3 pb-3 pl-4 pr-4">
              <h6 className="mb-4">Product Gallery</h6>
              <Slider {...productSliderOptions} ref={bigSliderRef} className="sliderBig mb-2">
                {imageUrls.map((url, index) => (
                  <div className="item" key={index}>
                    <img src={url} alt="ProductImages" className="w-100" />
                  </div>
                ))}
              </Slider>
              <Slider {...productSliderSmlOptions} className="sliderSml" ref={smallSliderRef}>
                {imageUrls.map((url, index) => (
                  <div
                    className={`item thumbnail-item ${activeIndex === index ? 'active' : ''}`}
                    key={index}
                    onClick={() => handleThumbnailClick(index)}
                    style={{ cursor: 'pointer' }}>
                    <img src={url} alt="ProductSmlImages" className="w-100" />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
          <div className="col-md-7">
            <div className="pt-3 pb-3 pl-4 pr-4">
              <h6 className="mb-4">Product Details</h6>
              <h4>Formal suits for men wedding slim fit 3 piece dress business party jacket</h4>

              <div className="productInfo mt-4">
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><MdBrandingWatermark /></span>
                    <span className="name">Brand</span>
                  </div>
                  <div className="col-sm-9">
                    <span>Ecstasy</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><BiSolidCategoryAlt /></span>
                    <span className="name">Category</span>
                  </div>
                  <div className="col-sm-9">
                    <span>Man's</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FiSettings /></span>
                    <span className="name">Tags</span>
                  </div>
                  <div className="col-sm-9">
                    <span>
                      <ul className="list list-inline tags sml">
                        <li className="list-inline-item">
                          <span>SUITE</span>
                        </li>
                        <li className="list-inline-item">
                          <span>PARTY</span>
                        </li>
                        <li className="list-inline-item">
                          <span>DRESS</span>
                        </li>
                        <li className="list-inline-item">
                          <span>SMART</span>
                        </li>
                        <li className="list-inline-item">
                          <span>MAN</span>
                        </li>
                        <li className="list-inline-item">
                          <span>STYLES</span>
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FaPalette /></span>
                    <span className="name">Color</span>
                  </div>
                  <div className="col-sm-9">
                    <span>
                      <ul className="list list-inline tags sml">
                        <li className="list-inline-item">
                          <span>RED</span>
                        </li>
                        <li className="list-inline-item">
                          <span>BLUE</span>
                        </li>
                        <li className="list-inline-item">
                          <span>WHITE</span>
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FiFileText /></span>
                    <span className="name">Size</span>
                  </div>
                  <div className="col-sm-9">
                    <span>
                      <ul className="list list-inline tags sml">
                        <li className="list-inline-item">
                          <span>SM</span>
                        </li>
                        <li className="list-inline-item">
                          <span>MD</span>
                        </li>
                        <li className="list-inline-item">
                          <span>LG</span>
                        </li>
                        <li className="list-inline-item">
                          <span>XL</span>
                        </li>
                        <li className="list-inline-item">
                          <span>XXL</span>
                        </li>
                      </ul>
                    </span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FaTag /></span>
                    <span className="name">Price</span>
                  </div>
                  <div className="col-sm-9">
                    <span>$37.00</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FaShoppingCart /></span>
                    <span className="name">Stock</span>
                  </div>
                  <div className="col-sm-9">
                    <span>(68) piece</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FaStar /></span>
                    <span className="name">Review</span>
                  </div>
                  <div className="col-sm-9">
                    <span>(03) Review</span>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-3 d-flex align-items-center">
                    <span className="icon"><FaShieldAlt /></span>
                    <span className="name">Published</span>
                  </div>
                  <div className="col-sm-9">
                    <span>02 feb 2020</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">

          <h6 className="mt-4 mb-3">Product Description</h6>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae reprehenderit repellendus expedita esse cupiditate quos doloremque rerum, corrupti ab illum est nihil, voluptate ex dignissimos! Sit voluptatem delectus nam, molestiae, repellendus ab sint quo aliquam debitis amet natus doloremque laudantium? Repudiandae, consequuntur, officiis quidem quo deleniti, autem non laudantium sequi error molestiae ducimus accusamus facere velit consectetur vero dolore natus nihil temporibus aspernatur quia consequatur? Consequuntur voluptate deserunt repellat tenetur debitis molestiae doloribus dicta. In rem illum dolorem atque ratione voluptates asperiores maxime doloremque laudantium magni neque ad quae quos quidem, quaerat rerum ducimus blanditiis reiciendis</p>
          <br/>

          <h6 class="mt-4 mb-4">Rating Analytics</h6>
          <div class="ratingSection">
            <div class="ratingrow d-flex align-items-center">
              <span class="col1">5 Star</span>
              <div class="col2">
                <div class="progress">
                  <div class="progress-bar" style={{ width: "70%" }}></div>
                </div>
              </div>
              <span class="col3">(22)</span>
            </div>
            <div class="ratingrow d-flex align-items-center">
              <span class="col1">4 Star</span>
              <div class="col2">
                <div class="progress">
                  <div class="progress-bar" style={{ width: "50%" }}></div>
                </div>
              </div>
              <span class="col3">(22)</span>
            </div>
            <div class="ratingrow d-flex align-items-center">
              <span class="col1">3 Star</span>
              <div class="col2">
                <div class="progress">
                  <div class="progress-bar" style={{ width: "50%" }}></div>
                </div>
              </div>
              <span class="col3">(2)</span>
            </div>
            <div class="ratingrow d-flex align-items-center">
              <span class="col1">2 Star</span>
              <div class="col2">
                <div class="progress">
                  <div class="progress-bar" style={{ width: "20%" }}></div>
                </div>
              </div>
              <span class="col3">(2)</span>
            </div>
            <div class="ratingrow d-flex align-items-center">
              <span class="col1">1 Star</span>
              <div class="col2">
                <div class="progress">
                  <div class="progress-bar" style={{ width: "50%" }}></div>
                </div>
              </div>
              <span class="col3">(2)</span>
            </div>
          </div>
          <br/>

          <h6 class="mt-4 mb-4">Customer-reviews</h6>
          <div className="reviewSection">
            <div className="reviewsRow">
              <div className="row d-flex">
                <div className="col-sm-7 d-flex d-flex flex-column">
                    <div className="userInfo d-flex align-items-center mb-3">
                        <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                      <div className="info pl-3">
                        <h6>Miron Mahmud</h6>
                        <span>25 minutes ago</span>
                      </div>
                    </div>
                    <Rating name="read-only" value={4.5} readOnly precision={0.5}/>
                </div>
                <div className="col-md-5 d-flex align-items-center">
                  <div className="ml-auto">
                    <Button className="btn-blue btn-big btn-lg ml-auto"><FaReply/>&nbsp; Reply</Button>
                  </div>
                </div>
                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>
              </div>
            </div>
            <div className="reviewsRow reply">
              <div className="row d-flex">
                <div className="col-sm-7 d-flex">
                  <div className="d-flex flex-column">
                    <div className="userInfo d-flex align-items-center mb-3">
                        <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                      <div className="info pl-3">
                        <h6>Miron Mahmud</h6>
                        <span>25 minutes ago</span>
                      </div>
                    </div>
                    <Rating name="read-only" value={4.5} readOnly precision={0.5}/>
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-center">
                  <div className="ml-auto">
                    <Button className="btn-blue btn-big btn-lg ml-auto"><FaReply/>&nbsp; Reply</Button>
                  </div>
                </div>
                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>
              </div>
            </div>
            <div className="reviewsRow">
              <div className="row d-flex">
                <div className="col-sm-7 d-flex">
                  <div className="d-flex flex-column">
                    <div className="userInfo d-flex align-items-center mb-3">
                        <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                      <div className="info pl-3">
                        <h6>Miron Mahmud</h6>
                        <span>25 minutes ago</span>
                      </div>
                    </div>
                    <Rating name="read-only" value={4.5} readOnly precision={0.5}/>
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-center">
                  <div className="ml-auto">
                    <Button className="btn-blue btn-big btn-lg ml-auto"><FaReply/>&nbsp; Reply</Button>
                  </div>
                </div>
                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>
              </div>
            </div>
            <div className="reviewsRow reply">
              <div className="row d-flex">
                <div className="col-sm-7 d-flex">
                  <div className="d-flex flex-column">
                    <div className="userInfo d-flex align-items-center mb-3">
                        <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg={true}/>
                      <div className="info pl-3">
                        <h6>Miron Mahmud</h6>
                        <span>25 minutes ago</span>
                      </div>
                    </div>
                    <Rating name="read-only" value={4.5} readOnly precision={0.5}/>
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-center">
                  <div className="ml-auto">
                    <Button className="btn-blue btn-big btn-lg ml-auto"><FaReply/>&nbsp; Reply</Button>
                  </div>
                </div>
                <p className="mt-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quo nostrum dolore fugiat ducimus labore debitis unde autem recusandae? Eius harum tempora quis minima, adipisci natus quod magni omnis quas.</p>
              </div>
            </div>
          </div>

          <h6 class="mt-4 mb-4">Review Reply Form</h6>
          <form className="reviewForm">
            <textarea placeholder="write here "></textarea>
            <Button className="btn-blue btn-big btn-lg w-100 mt-4">Drop Your Replies</Button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;