import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Breadcrumbs, Typography, Link as MuiLink, Button, Rating, } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { IoMdHome } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5';
import { FaCloudUploadAlt, FaRegImage } from 'react-icons/fa';
import CustomDropdown from '../../../components/CustomDropdown';
import { fetchDataFromApi, putData } from '../../../utils/api';
import { useSnackbar } from 'notistack';

const ProductEdit = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [formFields, setFormFields] = useState({
    name: '', description: '', brand: '', price: 0, oldPrice: 0, category: '', countInStock: 0, rating: 0, isFeatured: false, images: [],
  });
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [inputType, setInputType] = useState('url');
  const [initialData, setInitialData] = useState(null);
  const navigate = useNavigate();
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [ram, setRam] = useState('');
  const [weight, setWeight] = useState('');
  const [size, setSize] = useState('');
  const [addingUrl, setAddingUrl] = useState(false);

  useEffect(() => {
    if (formFields.subcategory) {
      setSubcategory(formFields.subcategory);
    }
  }, [formFields.subcategory]);

  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/products/${id}`);
      if (res) {
        setFormFields(res);
        setInitialData(res);
      } else {
        enqueueSnackbar('Product not found!', { variant: 'error' });
      }
    })();
  }, [id]);

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: ['price', 'oldPrice', 'countInStock'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // CATEGORY
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      let page = 1, all = [], hasMore = true;
      while (hasMore) {
        const res = await fetchDataFromApi(`/api/category?page=${page}`);
        if (res?.categoryList?.length) {
          all.push(...res.categoryList);
          page++;
          hasMore = page <= res.totalPages;
        } else {
          hasMore = false;
        }
      }
      setCategories(all.map((cat) => ({ value: cat._id, label: cat.name })));
    })();
  }, []);

  useEffect(() => {
    setFormFields((prev) => ({ ...prev, category }));
  }, [category]);

  // SUB CATEGORY
  const [subcategory, setSubcategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    if (!formFields.category || typeof formFields.category !== 'string') {
      setSubcategories([]);
      setSubcategory('');
      return;
    }

    (async () => {
      const res = await fetchDataFromApi(`/api/SubCat/by-category/${formFields.category}`);
      if (res && res.length > 0) {
        const options = res.map((sub) => ({ value: sub._id, label: sub.subCat }));
        setSubcategories(options);
      
        if (formFields.subcategory) {
          const found = options.find((o) => o.value === formFields.subcategory || o.value === formFields.subcategory._id);
          if (found) {
            setSubcategory(found.value);
          }
        }
      } else {
        setSubcategories([]);
        setSubcategory('');
      }
    })();
  }, [formFields.category, formFields.subcategory]);

  useEffect(() => {
    setFormFields((prev) => ({ ...prev, subcategory }));
  }, [subcategory]);

  // OTHERS
  const [isFeatured, setIsFeatured] = useState('');
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, isFeatured: isFeatured === '10' }));
  }, [isFeatured]);

  const [value, setValue] = useState(0);
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, rating: value }));
  }, [value]);

  const uploadImageViaServer = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/cloudinary/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Upload error:', err);
      return '';
    }
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    const requiredFields = [
      'name',
      'description',
      'brand',
      'price',
      'category',
      'countInStock',
    ];
    const missing = requiredFields.filter((f) => !formFields[f]);

    if (missing.length > 0) {
      enqueueSnackbar(`Please fill ${missing.join(', ')}`, { variant: 'error' });
      setLoadingSubmit(false);
      return;
    }

    const isSame = initialData && Object.entries(initialData).every(([key, value]) => {
      if (Array.isArray(value)) {
        return JSON.stringify(value) === JSON.stringify(formFields[key]);
      }
      return value === formFields[key];
    });

    if (isSame) {
      enqueueSnackbar("No changes made.", { variant: "error" });
      setLoadingSubmit(false);
      return;
    }

    const res = await putData(`/api/products/${id}`, formFields);
    if (res?.message?.toLowerCase().includes('updated')) {
      setLoadingSubmit(false);
      enqueueSnackbar('Product updated successfully!', { variant: 'success' });
      navigate('/products');
    } else {
      enqueueSnackbar(res?.message || 'Update failed', { variant: 'error' });
      setLoadingSubmit(false);
    }
  };

  const removeImage = (index) => {
    setFormFields((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleImageUrlInput = async () => {
    const url = imageUrlInput.trim();
    if (!url || formFields.images.includes(url)) return;

    setAddingUrl(true);
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/cloudinary/upload`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        },
      );

      const data = await res.json();
      if (data.secure_url) {
        setFormFields((prev) => ({
          ...prev,
          images: [...prev.images, data.secure_url],
        }));
        setImageUrlInput('');
      } else {
        enqueueSnackbar('Image upload failed!', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Image upload failed!', { variant: 'error' });
    } finally {
      setAddingUrl(false);
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setLoadingFiles(true);
    const uploadedUrls = [];

    for (let file of files) {
      const url = await uploadImageViaServer(file);
      if (url) uploadedUrls.push(url);
    }

    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));
    setLoadingFiles(false);
  };

  return (
    <div className="right-content w-100 product-upload">
      {/* BREADCRUMB */}
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Product Edit</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link" >
            <IoMdHome /> Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link" >
            Products
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }} >
            Product Edit
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={updateProduct}>
        <div className="card p-4 mt-0">
          <div className="form-group">
            <h6>PRODUCT NAME</h6>
            <input type="text" name="name" value={formFields.name} onChange={inputChange} />
          </div>
          <div className="form-group">
            <h6>DESCRIPTION</h6>
            <textarea name="description" rows="5" value={formFields.description} onChange={inputChange} />
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={formFields.category} options={categories} placeholder="None"
                    onChange={(val) =>
                      setFormFields((prev) => ({ ...prev, category: val }))
                    }
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SUB CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={subcategory} onChange={setSubcategory} options={subcategories}
                    placeholder={ !formFields.category ? "Select Category":
                      subcategories.length > 0 ? "Select Subcategory" : "No SubCategory Found" }
                    isDisabled={!formFields.category || subcategories.length === 0}
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>PRICE</h6>
                <input type="text" name="price" value={formFields.price} onChange={inputChange}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>OLD PRICE</h6>
                <input type="text" name="oldPrice" value={formFields.oldPrice} onChange={inputChange}/>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>IS FEATURED</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={formFields.isFeatured ? '10' : '20'}
                    onChange={(val) =>
                      setFormFields((prev) => ({
                        ...prev,
                        isFeatured: val === '10',
                      }))
                    }
                    options={[
                      { value: '10', label: 'True' },
                      { value: '20', label: 'False' },
                    ]}
                    placeholder="None"
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>PRODUCT STOCK</h6>
                <input type="text" name="countInStock" value={formFields.countInStock} onChange={inputChange}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>BRAND</h6>
                <input type="text" name="brand" value={formFields.brand} onChange={inputChange}/>
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
                <h6>RAM</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={ram} onChange={setRam} placeholder="None"
                    options={[
                      { value: '', label: 'None' },
                      { value: '10', label: '4GB' },
                      { value: '20', label: '8GB' },
                      { value: '30', label: '10GB' },
                      { value: '40', label: '12GB' },
                    ]}
                  />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>WEIGHT</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={weight} onChange={setWeight} placeholder="None"
                    options={[
                      { value: '', label: 'None' },
                      { value: '10', label: '15KG' },
                      { value: '20', label: '5KG' },
                    ]}
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SIZE</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={size} onChange={setSize} placeholder="None"
                    options={[
                      { value: '', label: 'None' },
                      { value: '10', label: 'S' },
                      { value: '20', label: 'M' },
                      { value: '30', label: 'L' },
                      { value: '40', label: 'XL' },
                      { value: '50', label: 'XXL' },
                      { value: '60', label: 'XXXL' },
                    ]}
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>RATING</h6>
                <Rating name="rating" value={formFields.rating}
                  onChange={(e, newVal) =>
                    setFormFields((prev) => ({ ...prev, rating: newVal }))
                  }
                />
              </div>
            </div>
          </div>

          {/* === IMAGE SECTION === */}
          {/* Type Selector */}
          <div className="form-group mt-4">
            <div className="form-group-radio mt-2 mb-2">
              <label>
                <input type="radio" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')}/>{' '}
                Image URL{' '}
              </label>
              &nbsp;&nbsp;
              <label>
                <input type="radio" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')}/>{' '}
                Upload Image{' '}
              </label>
            </div>

            {/* === URL INPUT === */}
            {inputType === 'url' && (
              <div className="form-group bottom">
                <div className="position-relative inputBtn mb-3" style={{ minHeight: 48 }}>
                  <input type="text" value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Enter image URL" style={{ paddingRight: '80px' }}/>
                  <Button className="btn-blue" type="button" disabled={addingUrl} onClick={handleImageUrlInput}>
                    {addingUrl ? ( <span className="dot-loader-sm"></span> ) : ( 'Add' )}
                  </Button>
                </div>
                <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3">
                  {formFields.images.map((src, i) => (
                    <div className="uploadBox" key={i}>
                      <span className="remove" onClick={() => removeImage(i)}>
                        <IoCloseSharp />
                      </span>
                      <div className="box">
                        <img className="w-100 preview" src={src} alt={`preview-${i}`}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {inputType === 'file' && (
              <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 bottom">
                {/* === IMAGE PREVIEW === */}
                {formFields.images.map((src, i) => (
                  <div className="uploadBox" key={i}>
                    <span className="remove" onClick={() => removeImage(i)}>
                      <IoCloseSharp />
                    </span>
                    <div className="box">
                      <img className="w-100 preview" src={src} alt={`preview-${i}`}/>
                    </div>
                  </div>
                ))}
                {/* === FILE UPLOAD BOX === */}
                <div className="uploadBox">
                  <input type="file" accept="image/*" multiple onChange={handleFileChange}/>
                  <div className="info">
                    <FaRegImage />
                    <h5>image upload</h5>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="btn-blue btn-lg btn-big w-100" disabled={loadingFiles || addingUrl || loadingSubmit}>
            <FaCloudUploadAlt /> &nbsp;{' '}
            {loadingFiles || addingUrl || loadingSubmit ? (<span className="dot-loader"></span> ) : ( 'PUBLISH AND VIEW' )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;