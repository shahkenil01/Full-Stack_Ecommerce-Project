import React, { useState } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from 'react-icons/io5';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { postData } from '../../../utils/api';
import { useSnackbar } from 'notistack';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('url');
  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    color: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const addImgUrl = (e) => {
    const url = e.target.value;
    setFormFields((prev) => ({ ...prev, images: [url] }));
    setImagePreview(url);
  };

  const removeImage = () => {
    setImagePreview(null);
    setUploadedFile(null);
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const { name, color, images } = formFields;

    if (!name.trim() || !color.trim()) {
      return enqueueSnackbar("Please fill all the details", { variant: "error" });
    }

    if (inputType === 'url' && (!images[0] || !images[0].trim())) {
      return enqueueSnackbar("Please provide image URL", { variant: "error" });
    }

    if (inputType === 'file' && !uploadedFile) {
      return enqueueSnackbar("Please upload an image", { variant: "error" });
    }

    const finalData = { name: name.trim(), color: color.trim(), images: [] };

    if (inputType === 'file') {
      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
      finalData.images = [await toBase64(uploadedFile)];
    } else {
      finalData.images = images;
    }

    setLoading(true);
    const res = await postData('/api/category/create', finalData);
    setLoading(false);

    if (res?.success) {
      enqueueSnackbar("Category created successfully!", { variant: "success" });
      navigate("/category");
    } else {
      enqueueSnackbar(
        res?.message === "Category name already exists"
          ? "Category name already exists!"
          : res?.message || "Failed to create category.",
        { variant: "error" }
      );
    }
  };

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Category</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/category" underline="hover" color="inherit" className="breadcrumb-link">
            Category
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Category
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addCategory}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>Category Name</h6>
                <input type="text" name="name" onChange={changeInput} />
              </div>

              <div className="form-group">
                <h6>Color</h6>
                <input type="text" name="color" onChange={changeInput} />
              </div>

              <div className="form-group-radio">
                <h6>Image Input Type</h6>
                <div>
                  <label>
                    <input type="radio" name="imageInputType" value="url" checked={inputType === 'url'} onChange={() => {
                      setInputType('url');
                      setImagePreview(null);
                      setUploadedFile(null);
                    }} /> Image URL
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input type="radio" name="imageInputType" value="file" checked={inputType === 'file'} onChange={() => {
                      setInputType('file');
                      setFormFields((prev) => ({ ...prev, images: [] }));
                    }} /> Upload Image
                  </label>
                </div>
              </div>

              {inputType === 'file' && (
                <div className="imagesUploadSec mt-3">
                  <h5 className="mb-4">Upload Image</h5>
                  <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                    {imagePreview && (
                      <div className="uploadBox">
                        <span className="remove" onClick={removeImage}><IoCloseSharp /></span>
                        <div className="box">
                          <img className="w-100" src={imagePreview} alt="preview" />
                        </div>
                      </div>
                    )}
                    {!imagePreview && (
                      <div className="uploadBox">
                        <input type="file" accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImagePreview(URL.createObjectURL(file));
                              setUploadedFile(file);
                            }
                          }} />
                        <div className="info">
                          <FaRegImage />
                          <h5>image upload</h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inputType === 'url' && (
                <div className="form-group mt-3">
                  <h6>Image URL</h6>
                  <input type="text" name="images" onChange={addImgUrl} />
                </div>
              )}

              <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loading}>
                <FaCloudUploadAlt />
                &nbsp;
                {loading ? <span className="dot-loader"></span> : "PUBLISH AND VIEW"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;