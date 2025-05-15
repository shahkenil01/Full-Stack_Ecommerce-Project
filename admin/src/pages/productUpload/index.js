import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button, Rating } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import FormControl from '@mui/material/FormControl';
import CustomDropdown from '../../components/CustomDropdown';
import { FaCloudUploadAlt, FaRegImage } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { fetchDataFromApi, postData } from '../../utils/api';
import Toast from "../../components/Toast";
import { uploadToCloudinary } from '../../utils/uploadToCloudinary';

const ProductUpload = () => {
  const [toasts, setToasts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState('');
  const [formFields, setFormFields] = useState({
    name: '', description: '', images: [], brand: '', price: 0, oldPrice: 0,
    category: '', countInStock: 0, rating: 0, isFeatured: false
  });
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/category?page=1`);
      const all = res?.categoryList || [];
      setCategories(all.map(cat => ({ value: cat._id, label: cat.name })));
    })();
  }, []);

  useEffect(() => {
    setFormFields((prev) => ({ ...prev, category, rating }));
  }, [category, rating]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: ['price', 'oldPrice', 'countInStock'].includes(name) ? Number(value) : value
    }));
  };

  // CATEGORY
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    (async () => {
      let page = 1, all = [], hasMore = true;
      while (hasMore) {
        const res = await fetchDataFromApi(`/api/category?page=${page}`);
        hasMore = res?.categoryList?.length > 0 && page < res.totalPages;
        all.push(...(res?.categoryList || []));
        page++;
      }
      setCategories(all.map(cat => ({ value: cat._id, label: cat.name })));
    })();
  }, []);
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, category }));
  }, [category]);

  // OTHERS
  const [subcategory, setSubcategory] = useState('');
  const [isFeatured, setIsFeatured] = useState('');
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, isFeatured: isFeatured === '10' }));
  }, [isFeatured]);

  const [ram, setRam] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [value, setValue] = useState(0);
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, rating: value }));
  }, [value]);

  // IMAGE HANDLING
  const [inputType, setInputType] = useState('url');
  const [imagesData, setImagesData] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const images = files.map((file) => ({
      src: URL.createObjectURL(file),
      type: 'file',
      file
    }));

    setImagesData(prev => {
      const existingKeys = new Set(prev.map(img => `${img.file?.name}-${img.file?.lastModified}`));
      const newUnique = images.filter(img => {
        const key = `${img.file?.name}-${img.file?.lastModified}`;
        return !existingKeys.has(key);
      });
      return [...prev, ...newUnique];
    });
  };

  const handleImageUrlInput = () => {
    const url = imageUrlInput.trim();
    if (!url || imagesData.some(img => img.src === url)) return;
    setImagesData(prev => [...prev, { src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  const removeImage = (index) => {
    setImagesData(prev => prev.filter((_, i) => i !== index));
  };

  const showToasts = (messages) => {
    let delay = 0;
    messages.forEach((msg, index) => {
      const toastObj = typeof msg === "string" ? { type: "error", message: msg } : msg;
      setTimeout(() => {
        setToast((prev) => [...prev, { id: Date.now() + index, ...toastObj }]);
      }, delay);
      delay += 300;
    });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requiredFields = ['name', 'description', 'brand', 'price', 'category', 'countInStock'];
    const missingFields = requiredFields.filter(f => !formFields[f]);
    if (imagesData.length === 0) missingFields.push('Image');
    if (missingFields.length > 0) {
      setLoading(false);
      showToasts(missingFields.map(f => `Please fill ${f}`));
      return;
    }

    const finalData = { ...formFields, images: [] };
    const cloudinaryUrls = [];
    const uploadedSet = new Set();

    for (const img of imagesData) {
      let url = '';
      if (img.type === 'file') {
        const key = `${img.file.name}-${img.file.lastModified}`;
        if (uploadedSet.has(key)) continue;
        uploadedSet.add(key);
        url = await uploadToCloudinary(img.file);
      } else if (img.type === 'url') {
        if (img.src.includes('res.cloudinary.com')) {
          url = img.src;
        } else {
          if (uploadedSet.has(img.src)) continue;
          uploadedSet.add(img.src);
          url = await uploadToCloudinary(img.src);
        }
      }
      if (url && !cloudinaryUrls.includes(url)) cloudinaryUrls.push(url);
    }

    finalData.images = cloudinaryUrls;
    const res = await postData('/api/products/create', finalData);
    setLoading(false);

    if (res && res._id) {
      setFormFields({ name: '', description: '', images: [], brand: '', price: 0, oldPrice: 0, category: '', countInStock: 0, rating: 0, isFeatured: false });
      setImagesData([]);
      navigate('/products', { state: { toast: { type: "success", message: "Product uploaded successfully!" } } });
    } else {
      setToast({ type: "error", message: res?.message || "Failed to upload product." });
    }
  };

  return (
    <div className="right-content w-100 product-upload">
      <div style={{ position: "fixed", left: "20px", bottom: "20px", zIndex: 9999, display: "flex", flexDirection: "column-reverse", gap: "5px" }}>
        {toasts.map((toastObj) => (
          <Toast key={toastObj.id} type={toastObj.type} message={toastObj.message} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toastObj.id))} />
        ))}
      </div>
      {/* BREADCRUMB */}
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Product Upload</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link">
            Products
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Product Upload
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addProduct}>
        <div className="card p-4 mt-0">
          <div className="form-group"><h6>PRODUCT NAME</h6><input type="text" name="name" onChange={inputChange} /></div>
          <div className="form-group"><h6>DESCRIPTION</h6><textarea name="description" rows="5" onChange={inputChange} /></div>

          <div className="row">
            <div className="col">
              <div className="form-group"><h6>CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={category} onChange={setCategory} options={categories} placeholder="None" />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group"><h6>SUB CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={subcategory} onChange={setSubcategory} options={[
                    { value: '', label: 'None' },
                    { value: '10', label: 'Jeans' },
                    { value: '20', label: 'Shirts' }
                  ]} placeholder="None" />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group"><h6>PRICE</h6><input type="text" name="price" onChange={inputChange} /></div>
            </div>
          </div>

          <div className="row">
            <div className="col"><div className="form-group"><h6>OLD PRICE</h6><input type="text" name="oldPrice" onChange={inputChange} /></div></div>
            <div className="col">
              <div className="form-group"><h6>IS FEATURED</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={isFeatured} onChange={setIsFeatured} options={[
                    { value: '', label: 'None' },
                    { value: '10', label: 'True' },
                    { value: '20', label: 'False' }
                  ]} placeholder="None" />
                </FormControl>
              </div>
            </div>
            <div className="col"><div className="form-group"><h6>PRODUCT STOCK</h6><input type="text" name="countInStock" onChange={inputChange} /></div></div>
          </div>

          <div className="row">
            <div className="col"><div className="form-group"><h6>BRAND</h6><input type="text" name="brand" onChange={inputChange} /></div></div>
            <div className="col"><div className="form-group"><h6>DISCOUNT</h6><input type="text" name="discount" /></div></div>
            <div className="col">
              <div className="form-group"><h6>RAM</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={ram} onChange={setRam} options={[
                    { value: '', label: 'None' },
                    { value: '10', label: '4GB' },
                    { value: '20', label: '8GB' },
                    { value: '30', label: '10GB' },
                    { value: '40', label: '12GB' }
                  ]} placeholder="None" />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group"><h6>WEIGHT</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={weight} onChange={setWeight} options={[
                    { value: '', label: 'None' },
                    { value: '10', label: '15KG' },
                    { value: '20', label: '5KG' }
                  ]} placeholder="None" />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group"><h6>SIZE</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={size} onChange={setSize} options={[
                    { value: '', label: 'None' },
                    { value: '10', label: 'S' },
                    { value: '20', label: 'M' },
                    { value: '30', label: 'L' },
                    { value: '40', label: 'XL' },
                    { value: '50', label: 'XXL' },
                    { value: '60', label: 'XXXL' }
                  ]} placeholder="None" />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group"><h6>RATING</h6>
                <Rating name="rating" value={value} onChange={(e, newVal) => setValue(newVal)} />
              </div>
            </div>
          </div>

          {/* === IMAGE SECTION === */}
          <div className="form-group-radio mt-3">
            <h6>Image Input Type</h6>
            <div>
              <label>
                <input type="radio" value="url" checked={inputType === 'url'} onChange={() => {
                  setInputType('url');
                }} /> Image URL
              </label>
              &nbsp;&nbsp;
              <label>
                <input type="radio" value="file" checked={inputType === 'file'} onChange={() => {
                  setInputType('file');
                }} /> Upload Image
              </label>
            </div>
          </div>

          {inputType === 'url' && (
            <div className="form-group mt-3">
              <h6 className="text-uppercase">Product Image</h6>
              <div className="position-relative inputBtn">
                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Enter image URL" style={{ paddingRight: '80px' }} />
                <Button className="btn-blue" type="button" onClick={handleImageUrlInput}>Add</Button>
              </div>

              <div className="imgGrid d-flex mt-3">
                {imagesData.map((img, idx) => (
                  <div className="img position-relative me-2" key={idx}>
                    <img src={img.src} alt="preview" className="w-100" />
                    <span className="remove" onClick={() => removeImage(idx)}><IoCloseSharp /></span>
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
                  <div className="uploadBox" key={idx}>
                    <span className="remove" onClick={() => removeImage(idx)}><IoCloseSharp /></span>
                    <div className="box"><img className="w-100" src={img.src} alt="preview" /></div>
                  </div>
                ))}
                <div className="uploadBox">
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                  <div className="info"><FaRegImage /><h5>image upload</h5></div>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="btn-blue btn-lg btn-big w-100 mt-4" disabled={loading}>
            <FaCloudUploadAlt /> &nbsp; {loading ? <span className="dot-loader"></span> : "PUBLISH AND VIEW"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
