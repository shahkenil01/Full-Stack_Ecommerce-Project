import React, { useState } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from 'react-icons/io5';

import { postData } from '../../../utils/api';
import { useSnackbar } from 'notistack';

const CategoryAdd = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('url');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageData, setImageData] = useState([]);

  const [formFields, setFormFields] = useState({
    name: '',
    color: ''
  });

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url || imageData.some((img) => img.src === url)) return;
    setImageData((prev) => [...prev, { src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({ src: URL.createObjectURL(file), type: 'file', file }));

    const existingKeys = new Set(imageData.map(img => img.file?.name + img.file?.lastModified));
    const uniqueFiles = newFiles.filter(img => {
      const key = img.file.name + img.file.lastModified;
      return !existingKeys.has(key);
    });

    setImageData(prev => [...prev, ...uniqueFiles]);
  };

  const removeImage = (index) => {
    setImageData((prev) => prev.filter((_, i) => i !== index));
  };

  const addCategory = async (e) => {
    e.preventDefault();
    const { name, color } = formFields;
    const missing = [];
    if (!name.trim()) missing.push('name');
    if (!color.trim()) missing.push('color');
    if (imageData.length === 0) missing.push('image');

    if (missing.length > 0) {
      enqueueSnackbar(`Please fill ${missing.join(', ')}`, { variant: "error" });
      return;
    }

    const finalData = { ...formFields, images: [] };

    const toBase64 = file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    const encodedImages = await Promise.all(
      imageData.map(async (img) => {
        if (img.type === 'url') return img.src;
        if (img.type === 'file') return await toBase64(img.file);
        return '';
      })
    );

    finalData.images = encodedImages;

    setLoading(true);
    const token = localStorage.getItem("userToken");
    const res = await postData('/api/category/create', finalData, token);
    setLoading(false);

    if (!res || res.success === false) return;

    enqueueSnackbar("Category created successfully!", { variant: "success", preventDuplicate: true });
    navigate("/category");
  };

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Category</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome /> Dashboard
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

              <div className="form-group-radio mt-3">
                <h6>Image Input Type</h6>
                <div>
                  <label>
                    <input type="radio" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')}/> Image URL
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input type="radio" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')}/> Upload Image
                  </label>
                </div>
              </div>

              {inputType === 'url' && (
                <div className="form-group mb-0">
                  <h6 className="text-uppercase mt-2">Category Image</h6>
                  {imageData.length === 0 && (
                    <div className="position-relative inputBtn">
                      <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Enter image URL" style={{ paddingRight: '80px' }} />
                      <Button className="btn-blue" type="button" onClick={addImageUrl}> Add </Button>
                    </div>
                  )}

                  <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mt-3">
                    {imageData.map((img, i) => (
                      <div className="uploadBox mb-3" key={i}>
                        <span className="remove" onClick={() => removeImage(i)}>
                          <IoCloseSharp />
                        </span>
                        <div className="box">
                          <img className="w-100 preview" src={img.src} alt={`preview-${i}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {inputType === 'file' && (
                <div className="imagesUploadSec mt-3 mb-3">
                  <h5 className="mb-3">Upload Image</h5>
                  <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                    {imageData.map((img, idx) => (
                      <div className="uploadBox" key={idx}>
                        <span className="remove" onClick={() => removeImage(idx)}>
                          <IoCloseSharp />
                        </span>
                        <div className="box">
                          <img className="w-100" src={img.src} alt="preview" />
                        </div>
                      </div>
                    ))}
                    {imageData.length === 0 && (
                      <div className="uploadBox">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <div className="info">
                          <FaRegImage />
                          <h5>image upload</h5>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loading}>
                <FaCloudUploadAlt /> &nbsp;
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