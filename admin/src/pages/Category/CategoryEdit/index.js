import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import { FaCloudUploadAlt, FaRegImage } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { useSnackbar } from 'notistack';

import { fetchDataFromApi, putData } from '../../../utils/api';

const CategoryEdit = () => {
  const { id } = useParams();
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

  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/category/${id}`).then((res) => {
        if (res) {
          setFormFields({ name: res.name || '', color: res.color || '' });

          if (Array.isArray(res.images) && res.images.length > 0) {
            setImageData([{ src: res.images[0], type: 'url' }]);
            setInputType(res.images[0].includes('cloudinary') ? 'url' : 'file');
          }
        }
      });
    }
  }, [id]);

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url || imageData.length > 0) return;
    setImageData([{ src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || imageData.length > 0) return;

    const src = URL.createObjectURL(file);
    setImageData([{ src, type: 'file', file }]);
  };

  const removeImage = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const res = await fetch(`/api/category/remove-image/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || result.msg || 'Failed to delete image');
      }

      enqueueSnackbar('Image deleted successfully!', { variant: 'success' });
      setImageData([]);
      setImageUrlInput('');
    } catch (err) {
      enqueueSnackbar(err.message || 'Error deleting image', { variant: 'error' });
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();

    const { name, color } = formFields;
    const missing = [];
    if (!name.trim()) missing.push('name');
    if (!color.trim()) missing.push('color');
    if (imageData.length === 0) missing.push('image');

    if (missing.length > 0) {
      enqueueSnackbar(`Please fill ${missing.join(', ')}`, { variant: 'error' });
      return;
    }

    const finalData = { ...formFields, images: [] };

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    if (imageData[0].type === 'url') {
      finalData.images = [imageData[0].src];
    } else if (imageData[0].type === 'file') {
      finalData.images = [await toBase64(imageData[0].file)];
    }

    setLoading(true);
    const token = localStorage.getItem('userToken');
    const res = await putData(`/api/category/${id}`, finalData, token);
    setLoading(false);

    if (res?.success) {
      if (res.message === 'Nothing to update') {
        enqueueSnackbar('Nothing to update', { variant: 'error', preventDuplicate: true });
      } else {
        enqueueSnackbar('Category updated successfully!', { variant: 'success', preventDuplicate: true });
        navigate('/category');
      }
    }
  };

  return (
    <div className="right-content w-100 product-upload">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Edit Category</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome /> Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/category" underline="hover" color="inherit" className="breadcrumb-link">
            Category
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Edit Category
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={updateCategory}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>Category Name</h6>
                <input type="text" name="name" value={formFields.name} onChange={changeInput} />
              </div>

              <div className="form-group">
                <h6>Color</h6>
                <input type="text" name="color" value={formFields.color} onChange={changeInput} />
              </div>

              <div className="form-group-radio mt-3">
                <h6>Image Input Type</h6>
                <div>
                  <label>
                    <input type="radio" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')} disabled={imageData.length > 0} /> Image URL
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input type="radio" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')} disabled={imageData.length > 0} /> Upload Image
                  </label>
                </div>
              </div>

              {inputType === 'url' && imageData.length === 0 && (
                <div className="form-group mt-3 be1">
                  <h6 className="text-uppercase">Category Image</h6>
                  <div className="position-relative inputBtn mb-3">
                    <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Enter image URL" style={{ paddingRight: '80px' }} />
                    <Button className="btn-blue" type="button" onClick={addImageUrl} disabled={imageData.length > 0}>Add</Button>
                  </div>
                </div>
              )}

              {inputType === 'file' && (
                <div className="imagesUploadSec mt-3 mb-4">
                  <h5 className="mb-3">Upload Image</h5>
                  <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                    {imageData.map((img, idx) => (
                      <div className="uploadBox" key={idx}>
                        <span className="remove" onClick={removeImage}><IoCloseSharp /></span>
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

              {imageData.length > 0 && inputType === 'url' && (
                <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mt-3 mb-3">
                  {imageData.map((img, i) => (
                    <div className="uploadBox" key={i}>
                      <span className="remove" onClick={removeImage}><IoCloseSharp /></span>
                      <div className="box">
                        <img className="w-100 preview" src={img.src} alt={`preview-${i}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loading}>
                <FaCloudUploadAlt /> &nbsp;
                {loading ? <span className="dot-loader"></span> : 'PUBLISH AND VIEW'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryEdit;