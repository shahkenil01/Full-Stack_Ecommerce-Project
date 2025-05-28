import React, { useState } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from 'react-icons/io5';

const AddHomeBannerSlide = () => {
  const [inputType, setInputType] = useState('url');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imagesData, setImagesData] = useState([]);

  // handle file input
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({
      src: URL.createObjectURL(file),
      type: 'file',
      file,
    }));

    setImagesData((prev) => {
      const existingKeys = new Set(prev.map((img) => `${img.file?.name}-${img.file?.lastModified}`));
      const newUnique = images.filter((img) => {
        const key = `${img.file?.name}-${img.file?.lastModified}`;
        return !existingKeys.has(key);
      });
      return [...prev, ...newUnique];
    });
  };

  // handle image URL input
  const handleImageUrlInput = () => {
    const url = imageUrlInput.trim();
    if (!url || imagesData.some((img) => img.src === url)) return;
    setImagesData((prev) => [...prev, { src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  // remove image
  const removeImage = (index) => {
    setImagesData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="right-content w-100 product-upload">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Home Slide</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome /> Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/homeBannerSlide/list" underline="hover" color="inherit" className="breadcrumb-link">
            Home Slide
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Home Slide
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="card p-4 mt-0">

          {/* === IMAGE SECTION === */}
          <div className="form-group-radio mt-3">
            <h6>Image Input Type</h6>
            <div>
              <label>
                <input
                  type="radio"
                  value="url"
                  checked={inputType === 'url'}
                  onChange={() => setInputType('url')}
                />{' '}
                Image URL
              </label>
              &nbsp;&nbsp;
              <label>
                <input
                  type="radio"
                  value="file"
                  checked={inputType === 'file'}
                  onChange={() => setInputType('file')}
                />{' '}
                Upload Image
              </label>
            </div>
          </div>

          {inputType === 'url' && (
            <div className="form-group mt-3 mb-2">
              <h6 className="text-uppercase">Product Image</h6>
              <div className="position-relative inputBtn">
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="Enter image URL"
                  style={{ paddingRight: '80px' }}
                />
                <Button className="btn-blue" type="button" onClick={handleImageUrlInput}>
                  Add
                </Button>
              </div>

              <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mt-3">
                {imagesData.map((img, idx) => (
                  <div className="uploadBox mb-2" key={idx}>
                    <span className="remove" onClick={() => removeImage(idx)}>
                      <IoCloseSharp />
                    </span>
                    <div className="box">
                      <img className="w-100" src={img.src} alt="preview" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {inputType === 'file' && (
            <div className="imagesUploadSec mt-3">
              <h5 className="mb-3">Upload Image(s)</h5>
              <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                {imagesData.map((img, idx) => (
                  <div className="uploadBox top" key={idx}>
                    <span className="remove" onClick={() => removeImage(idx)}>
                      <IoCloseSharp />
                    </span>
                    <div className="box">
                      <img className="w-100" src={img.src} alt="preview" />
                    </div>
                  </div>
                ))}
                <div className="uploadBox mb-4">
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                  <div className="info">
                    <FaRegImage />
                    <h5>image upload</h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button className="btn-blue btn-lg btn-big w-100">
            <FaCloudUploadAlt /> &nbsp; PUBLISH AND VIEW
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHomeBannerSlide;