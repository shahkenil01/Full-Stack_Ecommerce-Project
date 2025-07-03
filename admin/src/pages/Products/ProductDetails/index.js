import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs, Typography, Link as MuiLink, Button, Rating } from '@mui/material';
import { FaTag, FaShoppingCart, FaStar, FaShieldAlt, FaReply, FaPencilAlt } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { FiFileText } from "react-icons/fi";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { MdBrandingWatermark, MdDelete } from "react-icons/md";
import Slider from "react-slick";
import { fetchDataFromApi } from '../../../utils/api';
import UserAvatarImgComponent from "../../../components/userAvatarImg";
import { useSnackbar } from 'notistack';

const ProductDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const bigSliderRef = useRef(null);
  const smallSliderRef = useRef(null);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderReady, setSliderReady] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [replyTexts, setReplyTexts] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [editingReply, setEditingReply] = useState({ reviewId: null, index: null });
  const [editReplyText, setEditReplyText] = useState("");

  const [newReview, setNewReview] = useState({
    userName: "Anonymous",
    rating: 5,
    reviewText: ""
  });
  const [ratingBreakdown, setRatingBreakdown] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  const productSliderOptions = {
    dots: false,
    infinite: product?.images?.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: product?.images?.length > 1,
    autoplaySpeed: 4000,
    beforeChange: (current, next) => setActiveIndex(next),
  };

  const productSliderSmlOptions = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: Math.min(4, product?.images?.length || 1),
    slidesToScroll: 1,
    arrows: false,
  };

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    bigSliderRef.current?.slickGoTo(index);
    if (product?.images?.length > 1) smallSliderRef.current?.slickGoTo(index);
  };

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetchDataFromApi(`/api/products/${id}`);
      setProduct(res);
      setActiveIndex(0);
      setSliderReady(true);

      const reviewRes = await fetchDataFromApi(`/api/reviews/product/${id}`);
      setReviews(reviewRes || []);

      const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewRes?.forEach((r) => {
        const rating = Number(r.rating);
        const rounded = Math.round(rating);
        if (breakdown.hasOwnProperty(rounded)) {
          breakdown[rounded]++;
        }
      });
      setRatingBreakdown(breakdown);
    })();
  }, [id]);

  const createdDate = product?.dateCreated
    ? new Date(product.dateCreated).toLocaleDateString("en-IN", {
        year: "numeric", month: "short", day: "numeric"
      })
    : null;

  const handleReplySubmit = async (reviewId) => {
    const replyText = replyTexts[reviewId]?.trim();
    if (!replyText) {
      enqueueSnackbar("Reply text is empty", { variant: "error" });
      return;
    }

    try {
      const res = await fetch(`/api/reviews/reply/${reviewId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: "Admin", replyText })
      });

      const data = await res.json();
      if (res.ok) {
        setReplyTexts({ ...replyTexts, [reviewId]: "" });
        setActiveReplyId(null);
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? data.review : r))
        );
        enqueueSnackbar("Reply added successfully", { variant: "success" }); // ✅ success
      } else {
        enqueueSnackbar(data.message || "Failed to post reply", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Reply failed", { variant: "error" });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.reviewText.trim()) {
      enqueueSnackbar("Review is empty", { variant: "error" });
      return;
    }

    try {
      const res = await fetch(`/api/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          userName: newReview.userName,
          rating: newReview.rating,
          reviewText: newReview.reviewText
        })
      });

      const data = await res.json();
      if (res.ok) {
        const updatedReviews = [data, ...reviews];
          setReviews(updatedReviews);
          setNewReview({ userName: "Anonymous", rating: 5, reviewText: "" });

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        updatedReviews.forEach((r) => {
          const rating = Number(r.rating);
          const rounded = Math.round(rating);
          if (breakdown.hasOwnProperty(rounded)) {
            breakdown[rounded]++;
          }
        });
        setRatingBreakdown(breakdown);
        enqueueSnackbar("Review added successfully", { variant: "success" });
      } else {
        enqueueSnackbar(data.message || "Failed to post review", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Review add error", { variant: "error" });
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

      try {
        const res = await fetch(`/api/reviews/${reviewId}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok) {
          const updatedReviews = reviews.filter((r) => r._id !== reviewId);
          setReviews(updatedReviews);

          const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          updatedReviews.forEach((r) => {
            const rating = Number(r.rating);
            const rounded = Math.round(rating);
            if (breakdown.hasOwnProperty(rounded)) {
              breakdown[rounded]++;
            }
          });
          setRatingBreakdown(breakdown);
          enqueueSnackbar("Review deleted successfully", { variant: "success" });
        } else {
          enqueueSnackbar(data.message || "Failed to delete review", { variant: "error" });
        }
      } catch (err) {
        enqueueSnackbar("Delete request failed", { variant: "error" });
      }
    };

  const handleReplyEdit = (reviewId, index, text) => {
    setEditingReply({ reviewId, index });
    setEditReplyText(text);
  };

  const handleReplyEditSubmit = async () => {
    const { reviewId, index } = editingReply;
    if (!editReplyText.trim()) {
      enqueueSnackbar("Reply text cannot be empty", { variant: "error" });
      return;
    }

    try {
      const res = await fetch(`/api/reviews/reply/${reviewId}/${index}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: "Admin", replyText: editReplyText }),
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? data.review : r))
        );
        setEditingReply({ reviewId: null, index: null });
        setEditReplyText("");
        enqueueSnackbar("Reply updated successfully", { variant: "success" });
      } else {
        enqueueSnackbar(data.message || "Failed to update reply", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Reply update failed", { variant: "error" });
    }
  };

  const handleReplyDelete = async (reviewId, index) => {
    if (!window.confirm("Delete this reply?")) return;

    try {
      const res = await fetch(`/api/reviews/reply/${reviewId}/${index}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r._id === reviewId ? data.review : r))
        );
        enqueueSnackbar("Reply deleted", { variant: "success" });
      } else {
        enqueueSnackbar(data.message || "Delete failed", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Delete request error", { variant: "error" });
    }
  };

  if (!product) return <div className="right-content w-100">Loading...</div>;

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
              {sliderReady && (
                <>
                  <Slider {...productSliderOptions} ref={bigSliderRef} className="sliderBig mb-2">
                    {(product.images || []).map((url, index) => (
                      <div className="item" key={index}>
                        <img src={url} alt={`Product-${index}`} className="w-100" />
                      </div>
                    ))}
                  </Slider>
                  {product.images.length > 1 && (
                    <Slider {...productSliderSmlOptions} ref={smallSliderRef} className="sliderSml">
                      {product.images.map((url, index) => (
                        <div
                          key={index}
                          className={`item thumbnail-item ${activeIndex === index ? 'active' : ''}`}
                          onClick={() => handleThumbnailClick(index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <img src={url} alt={`Thumb-${index}`} className="w-100" />
                        </div>
                      ))}
                    </Slider>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="col-md-7">
            <div className="pt-3 pb-3 pl-4 pr-4">
              <h6 className="mb-4">Product Details</h6>
              <h4>{product.name || "N/A"}</h4>

              <div className="productInfo mt-4">
                {[
                  { icon: <MdBrandingWatermark />, label: "Brand", value: product.brand },
                  { icon: <BiSolidCategoryAlt />, label: "Category", value: product.category?.name },
                  { icon: <FaTag />, label: "Price", value: `₹${product.price || "0"}` },
                  { icon: <FaShoppingCart />, label: "Stock", value: `(${product.countInStock || 0}) piece` },
                  { icon: <FaStar />, label: "Review", value: `(${reviews.length}) Review` },
                  createdDate && { icon: <FaShieldAlt />, label: "Published", value: createdDate }
                ].filter(Boolean).map((item, idx) => (
                  <div className="row" key={idx}>
                    <div className="col-sm-3 d-flex align-items-center">
                      <span className="icon">{item.icon}</span>
                      <span className="name">{item.label}</span>
                    </div>
                    <div className="col-sm-9"><span>{item.value || "N/A"}</span></div>
                  </div>
                ))}

                {(() => {
                  const key = product.productSIZE?.length ? 'productSIZE' :
                              product.productWEIGHT?.length ? 'productWEIGHT' :
                              product.productRAMS?.length ? 'productRAMS' : null;
                  if (!key) return null;

                  const labelMap = {
                    productSIZE: 'Size',
                    productWEIGHT: 'Weight',
                    productRAMS: 'RAM'
                  };

                  return (
                    <div className="row">
                      <div className="col-sm-3 d-flex align-items-center">
                        <span className="icon"><FiFileText /></span>
                        <span className="name">{labelMap[key]}</span>
                      </div>
                      <div className="col-sm-9">
                        <ul className="list list-inline tags sml ml-3">
                          {product[key].map((val, i) => (
                            <li className="list-inline-item" key={i}><span>{val}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h6 className="mt-4 mb-3">Product Description</h6>
          <p>{product.description}</p>

          <h6 className="mt-4 mb-4">Rating Analytics</h6>
          <div className="ratingSection">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingBreakdown[star] || 0;
              const total = reviews.length || 1; // to prevent divide by zero
              const percent = Math.round((count / total) * 100);

              return (
                <div className="ratingrow d-flex align-items-center" key={star}>
                  <span className="col1">{star} Star</span>
                  <div className="col2">
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                  <span className="col3">({count})</span>
                </div>
              );
            })}
          </div>

          {reviews.length > 0 && (
            <>
              <h6 className="mt-4 mb-4">Customer-reviews</h6>
              <div className="reviewSection">
                {reviews.map((rev, i) => (
                  <div key={i}>
                    <div className="reviewsRow">
                      <div className="row d-flex">
                        <div className="col-sm-7 d-flex flex-column">
                          <div className="userInfo d-flex align-items-center mb-3">
                            <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg />
                            <div className="info pl-3">
                              <h6>{rev.userName}</h6>
                              <span>{new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                year: "numeric", month: "short", day: "numeric"
                              })}</span>
                            </div>
                          </div>
                          <Rating name="read-only" value={rev.rating} readOnly precision={0.5} />
                        </div>
                        <div className="col-md-5 d-flex align-items-center">
                          <div className="d-flex align-items-center justify-content-end gap-2 w-100" style={{marginTop: "-45px"}}>
                            <Button
                              className="btn-blue btn-big btn-lg ml-auto"
                              onClick={() => setActiveReplyId(activeReplyId === rev._id ? null : rev._id)}
                            >
                              <FaReply />&nbsp; Reply
                            </Button>
                            <button className="action-btn btn-delete ml-3" onClick={() => handleReviewDelete(rev._id)}>
                              <MdDelete />
                            </button>
                          </div>
                        </div>
                        <p className="mt-3">{rev.reviewText}</p>
                      </div>
                    </div>

                    {rev.replies?.map((rep, j) => (
                      <div className="reviewsRow reply" key={j}>
                        <div className="row"></div>
                        <div className="row d-flex align-items-center">
                          <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <UserAvatarImgComponent img="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" lg />
                              <div className="info pl-3">
                                <h6 className="mb-1">{rep.userName}</h6>
                                <span>{new Date(rep.createdAt).toLocaleDateString("en-IN", {
                                  year: "numeric", month: "short", day: "numeric"
                                })}</span>
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <button className="action-btn btn-edit" onClick={() => handleReplyEdit(rev._id, j, rep.replyText)} >
                                <FaPencilAlt />
                              </button>
                              <button className="action-btn btn-delete ml-3" onClick={() => handleReplyDelete(rev._id, j)} >
                                <MdDelete />
                              </button>
                            </div>
                          </div>

                          <div className="col-md-12">
                            {editingReply.reviewId === rev._id && editingReply.index === j ? (
                              <>
                                <textarea className="reviewReplay mt-3" value={editReplyText}
                                  onChange={(e) => setEditReplyText(e.target.value)} />
                                <div className="ml-auto">
                                <Button className="btn-blue btn-big btn-lg mt-3" onClick={handleReplyEditSubmit} >
                                  Save Reply
                                </Button>
                                </div>
                              </>
                            ) : (
                              <p className="mt-3 mb-0">{rep.replyText}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {activeReplyId === rev._id && (
                      <div className="reviewsRow reply">
                        <form className="reviewForm w-100">
                          <textarea className="reviewReplay" placeholder="write here"
                            value={replyTexts[rev._id] || ""}
                            onChange={(e) => setReplyTexts({ ...replyTexts, [rev._id]: e.target.value }) }
                          />
                          <Button className="btn-blue btn-big btn-lg w-100 mt-4" onClick={() => handleReplySubmit(rev._id)} >
                            Drop Your Replies
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <h6 className="mt-4 mb-4">Review Reply Form</h6>
          <form className="reviewForm">
            <textarea placeholder="Write your review here" value={newReview.reviewText}
              onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value }) }
            />
            <div className="mt-3 mb-3">
              <Rating name="new-review-rating" value={newReview.rating} precision={0.5}
                onChange={(e, newVal) => setNewReview({ ...newReview, rating: newVal }) }
              />
            </div>
            <Button className="btn-blue btn-big btn-lg w-100 mt-4" onClick={handleReviewSubmit} >
              Drop Your Review
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;