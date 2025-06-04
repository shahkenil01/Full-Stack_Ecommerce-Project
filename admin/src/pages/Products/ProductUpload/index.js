import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button, Rating } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from 'react-icons/io';
import FormControl from '@mui/material/FormControl';
import CustomDropdown from '../../../components/CustomDropdown';
import { FaCloudUploadAlt, FaRegImage } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { fetchDataFromApi, postData } from '../../../utils/api';
import { uploadToCloudinary } from '../../../utils/uploadToCloudinary';
import { useSnackbar } from 'notistack';

const ProductUpload = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  // === FORM STATES ===
  const [formFields, setFormFields] = useState({
    name: '', description: '', images: [], brand: '', price: 0, oldPrice: 0, category: '', countInStock: 0, rating: 0, isFeatured: false,
  });

  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [ram, setRam] = useState([]);
  const [weight, setWeight] = useState([]);
  const [size, setSize] = useState([]);
  const [value, setValue] = useState(0);
  const [isFeatured, setIsFeatured] = useState('');

  const [ramList, setRamList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [weightList, setWeightList] = useState([]);

  // === IMAGE HANDLING STATES ===
  const [inputType, setInputType] = useState('url');
  const [imagesData, setImagesData] = useState([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const navigate = useNavigate();

  // === FETCH CATEGORIES FOR DROPDOWN ===
  useEffect(() => {
    (async () => {
      let page = 1, all = [], hasMore = true;
      while (hasMore) {
        const res = await fetchDataFromApi(`/api/category?page=${page}`);
        hasMore = res?.categoryList?.length > 0 && page < res.totalPages;
        all.push(...(res?.categoryList || []));
        page++;
      }
      setCategories(all.map((cat) => ({ value: cat._id, label: cat.name })));
    })();
  }, []);

  // === FETCH SUBCATEGORIES BASED ON SELECTED CATEGORY ===
  useEffect(() => {
    if (!category || typeof category !== 'string') {
      setSubcategories([]);
      setSubcategory('');
      return;
    }
    (async () => {
      const res = await fetchDataFromApi(`/api/SubCat/by-category/${category}`);
      if (res && res.length > 0) {
        setSubcategories(res.map((sub) => ({ value: sub._id, label: sub.subCat })));
      } else {
        setSubcategories([]);
      }
      setSubcategory('');
    })();
  }, [category]);

  // === FETCH RAM, SIZE, WEIGHT OPTIONS ===
  useEffect(() => {
    (async () => {
      const ramRes = await fetchDataFromApi('/api/rams');
      const sizeRes = await fetchDataFromApi('/api/sizes');
      const weightRes = await fetchDataFromApi('/api/weights');

      if (ramRes?.data) setRamList(ramRes.data.map(item => ({ value: item.name, label: item.name })));
      if (sizeRes?.data) setSizeList(sizeRes.data.map(item => ({ value: item.name, label: item.name })));
      if (weightRes?.data) setWeightList(weightRes.data.map(item => ({ value: item.name, label: item.name })));
    })();
  }, []);

  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      productRAMS: ram,
      productSIZE: size,
      productWEIGHT: weight,
    }));
  }, [ram, size, weight]);

  // === SET FORM FIELD ON INDIVIDUAL CHANGE ===
  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: ['price', 'oldPrice', 'countInStock'].includes(name) ? Number(value) : value,
    }));
  };

  // === UPDATE FORM FIELDS WHEN CATEGORY, SUBCATEGORY, RATING ETC CHANGE ===
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, category, rating }));
  }, [category, rating]);

  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      subcategory: subcategory || undefined
    }));
  }, [subcategory]);

  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      productRAMS: ram,
      productSIZE: size,
      productWEIGHT: weight,
    }));
  }, [ram, size, weight]);

  useEffect(() => {
    setFormFields((prev) => ({ ...prev, isFeatured: isFeatured === '10' }));
  }, [isFeatured]);

  useEffect(() => {
    setFormFields((prev) => ({ ...prev, rating: value }));
  }, [value]);

  // === HANDLE IMAGE FILE UPLOAD ===
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const images = files.map((file) => ({
      src: URL.createObjectURL(file),
      type: 'file',
      file,
    }));

    setImagesData((prev) => {
      const existingKeys = new Set(
        prev.map((img) => `${img.file?.name}-${img.file?.lastModified}`),
      );
      const newUnique = images.filter((img) => {
        const key = `${img.file?.name}-${img.file?.lastModified}`;
        return !existingKeys.has(key);
      });
      return [...prev, ...newUnique];
    });
  };

  // === HANDLE IMAGE URL INPUT ===
  const handleImageUrlInput = () => {
    const url = imageUrlInput.trim();
    if (!url || imagesData.some((img) => img.src === url)) return;
    setImagesData((prev) => [...prev, { src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  // === REMOVE AN IMAGE FROM IMAGE ARRAY ===
  const removeImage = (index) => {
    setImagesData((prev) => prev.filter((_, i) => i !== index));
  };

  // === SHOW ERROR/SUCCESS TOAST MESSAGES ===
  const showToasts = (messages) => {
    messages.forEach((msg) => {
      const message = typeof msg === 'string' ? msg : msg.message;
      const variant = typeof msg === 'string' ? 'error' : msg.type || 'default';
      enqueueSnackbar(message, { variant });
    });
  };

  // === HANDLE PRODUCT SUBMIT ===
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    const requiredFields = ['name', 'description', 'brand', 'price', 'category', 'countInStock'];
    const missingFields = requiredFields.filter((f) => !formFields[f]);
    if (imagesData.length === 0) missingFields.push('Image');

    if (missingFields.length > 0) {
      setLoading(false);
      showToasts(missingFields.map((f) => `Please fill ${f}`));
      return;
    }

    // Prepare final data with uploaded image URLs
    const finalData = { ...formFields, images: [] };

    if (subcategory && subcategory !== "") {
      finalData.subcategory = subcategory;
    }

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

    // Post to API
    const res = await postData('/api/products/create', finalData);
    setLoading(false);

    if (res && res._id) {
      // Reset form
      setFormFields({
        name: '', description: '', images: [], brand: '', price: 0, oldPrice: 0,
        category: '', subcategory: '', countInStock: 0, rating: 0, isFeatured: false,
      });
      setImagesData([]);
      enqueueSnackbar('Product uploaded successfully!', { variant: 'success' });
      navigate('/products');
    } else {
      enqueueSnackbar(res?.message || 'Failed to upload product.', { variant: 'error' });
    }
  };

  return (
    <div className="right-content w-100 product-upload">
      {/* BREADCRUMB */}
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Product Upload</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link" >
            <IoMdHome /> Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link" >
            Products
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }} >
            Product Upload
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addProduct}>
        <div className="card p-4 mt-0">
          <div className="form-group">
            <h6>PRODUCT NAME</h6>
            <input type="text" name="name" onChange={inputChange} />
          </div>
          <div className="form-group">
            <h6>DESCRIPTION</h6>
            <textarea name="description" rows="5" onChange={inputChange} />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={category} onChange={setCategory} options={categories} placeholder="Select"/>
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SUB CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={subcategory} onChange={setSubcategory} options={subcategories} 
                    placeholder={!category ? "Select Category" :
                    subcategories.length > 0 ? "Select Subcategory" : "No SubCategory Found"} 
                    isDisabled={!category || subcategories.length === 0}/>
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>IS FEATURED</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={isFeatured} onChange={setIsFeatured}
                    options={[
                      { value: '', label: 'None' },
                      { value: '10', label: 'True' },
                      { value: '20', label: 'False' },
                    ]}
                    placeholder="None"
                  />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>PRICE</h6>
                <input type="text" name="price" onChange={inputChange} />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>OLD PRICE</h6>
                <input type="text" name="oldPrice" onChange={inputChange} />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>PRODUCT STOCK</h6>
                <input type="text" name="countInStock" onChange={inputChange} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>BRAND</h6>
                <input type="text" name="brand" onChange={inputChange} />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>DISCOUNT</h6>
                <input type="text" name="discount" />
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>RATING</h6>
                <Rating name="rating" value={value} onChange={(e, newVal) => setValue(newVal)} />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>WEIGHT</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={weight} onChange={setWeight} options={weightList} placeholder="Select Weight" isMulti={true}/>
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SIZE</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={size} onChange={setSize} options={sizeList} placeholder="Select Size" isMulti={true}/>
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>RAM</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={ram} onChange={setRam} options={ramList} placeholder="Select RAM" isMulti={true}/>
                </FormControl>
              </div>
            </div>
          </div>

          {/* === IMAGE SECTION === */}
          <div className="form-group-radio mt-3">
            <h6>Image Input Type</h6>
            <div>
              <label>
                <input type="radio" value="url" checked={inputType === 'url'} onChange={() => { setInputType('url'); }} />{' '}
                Image URL
              </label>
              &nbsp;&nbsp;
              <label>
                <input type="radio" value="file" checked={inputType === 'file'} onChange={() => { setInputType('file'); }} />{' '}
                Upload Image
              </label>
            </div>
          </div>

          {inputType === 'url' && (
            <div className="form-group mt-3 be1">
              <h6 className="text-uppercase">Product Image</h6>
              <div className="position-relative inputBtn">
                <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Enter image URL" 
                  style={{ paddingRight: '80px' }} />
                <Button className="btn-blue" type="button" onClick={handleImageUrlInput} > Add </Button>
              </div>

               <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mt-3 mb-3">
                {imagesData.map((img, i) => (
                  <div className="uploadBox" key={i}>
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
            <div className="imagesUploadSec mt-3 mb-4">
              <h5 className="mb-3">Upload Image(s)</h5>
              <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                {imagesData.map((img, idx) => (
                  <div className="uploadBox" key={idx}>
                    <span className="remove" onClick={() => removeImage(idx)}>
                      <IoCloseSharp />
                    </span>
                    <div className="box">
                      <img className="w-100" src={img.src} alt="preview" />
                    </div>
                  </div>
                ))}
                <div className="uploadBox">
                  <input type="file" accept="image/*" multiple onChange={handleFileChange} />
                  <div className="info">
                    <FaRegImage />
                    <h5>image upload</h5>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loading} >
            <FaCloudUploadAlt /> &nbsp;{' '}
            {loading ? ( <span className="dot-loader"></span> ) : ( 'PUBLISH AND VIEW' )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductUpload;
