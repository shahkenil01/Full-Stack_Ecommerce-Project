import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from 'react-icons/io5';

import { fetchDataFromApi, putData } from '../../utils/api';
import Toast from "../../components/Toast";

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [inputType, setInputType] = useState('url');

  const [formFields, setFormFields] = useState({
    name: '',
    images: [],
    color: ''
  });

  const [images, setImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    if (id) {
      fetchDataFromApi(`/api/category/${id}`).then((res) => {
        if (res) {
          setFormFields({
            name: res.name,
            images: res.images,
            color: res.color
          });

          if (res.images?.length) {
            setImages([{ preview: res.images[0] }]);
          }
        }
      });
    }
  }, [id]);

  const changeInput = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addImgUrl = (e) => {
    setFormFields((prev) => ({
      ...prev,
      images: [e.target.value]
    }));
    setImages([{ preview: e.target.value }]);
  };

  const removeImage = () => {
    setImages([]);
    setUploadedFiles([]);
    setFormFields((prev) => ({ ...prev, images: [] }));
  };

  const addCategory = async (e) => {
    e.preventDefault();

    if (!formFields.name.trim() || !formFields.color.trim()) {
      setToast({ type: "error", message: "Please fill all the details" });
      return;
    }

    if (inputType === 'url' && (!formFields.images || !formFields.images[0]?.trim())) {
      setToast({ type: "error", message: "Please provide image URL" });
      return;
    }

    if (inputType === 'file') {
      if (uploadedFiles.length === 0) {
        setToast({ type: "error", message: "Please upload a new image or Details" });
        return;
      }

      const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      const base64Images = await Promise.all(
        Array.from(uploadedFiles).map(file => toBase64(file))
      );
      formFields.images = base64Images;
    }

    setLoading(true);
    const res = await putData(`/api/category/${id}`, formFields);

    if (res?.message === "Category updated") {
      navigate("/category", {
        state: {
          toast: { type: "success", message: "Category updated successfully!" }
        }
      });
    } else {
      setToast({ type: "error", message: res?.message || "Failed to update category." });
    }

    setLoading(false);
  };

  return (
    <div className="right-content w-100 product-upload">
      <div style={{ position: "fixed", left: "20px", bottom: "20px", zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: "5px", }}>
        {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      </div>

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Edit Category</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/category" underline="hover" color="inherit" className="breadcrumb-link">
            Category
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Edit Category
          </Typography>
        </Breadcrumbs>
      </div>

      <form className='form' onSubmit={addCategory}>
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

              <div className="form-group-radio">
                <h6>Image Input Type</h6>
                <div>
                  <label>
                    <input type="radio" name="imageInputType" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')} />
                    &nbsp;Image URL
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input type="radio" name="imageInputType" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')} />
                    &nbsp;Upload Image
                  </label>
                </div>
              </div>

              {inputType === 'file' && (
                <div className='imagesUploadSec mt-3'>
                  <h5 className="mb-4">Upload Image</h5>
                  <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                    {images.length > 0 && (
                      <div className="uploadBox">
                        <span className="remove" onClick={removeImage}><IoCloseSharp /></span>
                        <div className="box">
                          <img className="w-100" src={images[0].preview} alt="preview" />
                        </div>
                      </div>
                    )}
                    <div className="uploadBox">
                      <input type="file" accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const preview = URL.createObjectURL(file);
                            setImages([{ file, preview }]);
                            setUploadedFiles([file]);
                          }
                        }} />
                      <div className="info">
                        <FaRegImage />
                        <h5>image upload</h5>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {inputType === 'url' && (
                <div className="form-group mt-3">
                  <h6>Image Url</h6>
                  <input type="text" name="images" value={formFields.images[0] || ''} onChange={addImgUrl} />
                </div>
              )}

              <Button type='submit' className='btn-blue btn-lg btn-big w-100 mt-4' disabled={loading}>
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

export default CategoryEdit;