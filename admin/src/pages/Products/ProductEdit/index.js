import { useState, useEffect } from 'react';
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
  const navigate = useNavigate();

  const [formFields, setFormFields] = useState({
    name: '', description: '', brand: '', price: 0, oldPrice: 0, category: '', countInStock: 0, rating: 0, isFeatured: false, images: [],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [inputType, setInputType] = useState('url');
  const [initialData, setInitialData] = useState(null);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);

  // CATEGORY handling
  const [categories, setCategories] = useState([]);

  // SUBCATEGORY handling
  const [subcategory, setSubcategory] = useState('');
  const [subcategories, setSubcategories] = useState([]);

  // Rating and feature flag
  const [value, setValue] = useState(0);
  const [isFeatured, setIsFeatured] = useState('');

  // ========================= FETCH PRODUCT DETAILS =========================
  useEffect(() => {
    (async () => {
      const res = await fetchDataFromApi(`/api/products/${id}`);
      if (!res) {
        enqueueSnackbar('Product not found!', { variant: 'error' });
        return;
      }

      const categoryId = typeof res.category === 'object' ? res.category._id : res.category;
      const subcategoryId = res.subcategory ? typeof res.subcategory === 'object' ? res.subcategory._id : res.subcategory : '';

      const subRes = await fetchDataFromApi(`/api/SubCat/by-category/${categoryId}`);
      const subOptions = Array.isArray(subRes)
        ? subRes.map((sub) => ({ value: sub._id, label: sub.subCat }))
        : [];

      setSubcategories(subOptions);
      setSubcategory(subcategoryId);

      setFormFields({
        ...res,
        category: categoryId,
        subcategory: subOptions.find((opt) => opt.value === subcategoryId) || '',
        oldPrice: res.oldPrice ?? '',
        price: res.price ?? '',
        countInStock: typeof res.countInStock === 'number' ? res.countInStock : 0,
      });

      setInitialData(res);
      setRam(res.productRAMS || []);
      setSize(res.productSIZE || []);
      setWeight(res.productWEIGHT || []);
    })();
  }, [id]);

  useEffect(() => {
    if (subcategory && subcategories.length > 0) {
      const found = subcategories.find((opt) => opt.value === subcategory);
      if (found) {
        setFormFields((prev) => ({ ...prev, subcategory: found.value }));
      }
    }
  }, [subcategory, subcategories]);

  // ========================= FETCH CATEGORIES =========================
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

  // ========================= FETCH SUBCATEGORIES =========================
  useEffect(() => {
    (async () => {
      if (!formFields.category) return;

      const res = await fetchDataFromApi(`/api/SubCat/by-category/${formFields.category}`);
      if (res && res.length > 0) {
        const options = res.map((sub) => ({ value: sub._id, label: sub.subCat }));
        setSubcategories(options);

        const matched = options.find((o) =>
          o.value === formFields.subcategory || o.value === formFields.subcategory?._id
        );
        setSubcategory(matched ? matched.value : '');
      } else {
        setSubcategories([]);
        setSubcategory('');
      }
    })();
  }, [formFields.category, formFields.subcategory]);

  // Sync feature flag to formFields
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, isFeatured: isFeatured === '10' }));
  }, [isFeatured]);

  // Sync rating to formFields
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, rating: value }));
  }, [value]);

  // ========================= HANDLE FORM INPUTS =========================
  const inputChange = (e) => {
    const { name, value } = e.target;

      const cleanValue = ['countInStock'].includes(name)
        ? Number(value)
        : value;

      setFormFields((prev) => ({
        ...prev,
        [name]: cleanValue,
    }));
  };

  // ========================= FATCH RAM, WEIGHT, SIZE =========================
  const [ramList, setRamList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [weightList, setWeightList] = useState([]);

  const [ram, setRam] = useState([]);     // MULTI SELECT
  const [size, setSize] = useState([]);
  const [weight, setWeight] = useState([]);

  useEffect(() => {
    setFormFields((prev) => ({
      ...prev,
      productRAMS: ram,
      productSIZE: size,
      productWEIGHT: weight
    }));
  }, [ram, size, weight]);

  useEffect(() => {
    (async () => {
      const [ramRes, sizeRes, weightRes] = await Promise.all([
        fetchDataFromApi('/api/rams'),
        fetchDataFromApi('/api/sizes'),
        fetchDataFromApi('/api/weights'),
      ]);

      if (Array.isArray(ramRes?.data)) {
        setRamList(ramRes.data.map(item => ({ value: item.name, label: item.name })));
      }
      if (sizeRes?.data) {
        setSizeList(sizeRes.data.map(item => ({ value: item.name, label: item.name })));
      }
      if (Array.isArray(sizeRes?.data)) {
        setWeightList(weightRes.data.map(item => ({ value: item.name, label: item.name })));
      }
    })();
  }, []);

  // ========================= IMAGE UPLOAD FUNCTIONS =========================
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

  const handleImageUrlInput = async () => {
    const url = imageUrlInput.trim();
    if (!url || formFields.images.includes(url)) return;

    setFormFields((prev) => ({
      ...prev,
      images: [...prev.images, url],
    }));

    setImageUrlInput('');
  };

  const removeImage = (index) => {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    if (!user || user.role !== "admin") {
      enqueueSnackbar("Only admin can delete images", { variant: "error" });
      return;
    }
    setFormFields((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ========================= PRODUCT UPDATE SUBMISSION =========================
  const updateProduct = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    // Required field check
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
      const newVal = formFields[key];

      if (Array.isArray(value)) {
        return JSON.stringify(value) === JSON.stringify(newVal);
      }

      if (key === 'subcategory') {
        const oldSubId = typeof value === 'object' ? value._id : value;
        const newSubId = typeof newVal === 'object' ? newVal.value : newVal;
        return oldSubId === newSubId;
      }
      return value === newVal;
    });

    if (isSame) {
      enqueueSnackbar("No changes made.", { variant: "error" });
      setLoadingSubmit(false);
      return;
    }

    const token = localStorage.getItem("userToken");
    const payload = { ...formFields };
      if (!payload.subcategory) {
      delete payload.subcategory;
    }

    // Submit update to backend
    const res = await putData(`/api/products/${id}`, payload, token);
    if (!res || res.success === false) { setLoadingSubmit(false); return; }
    
    enqueueSnackbar('Product updated successfully!', { variant: 'success' });
    navigate('/products');
    setLoadingSubmit(false);
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
                  <CustomDropdown value={ typeof formFields.category === "object" ? formFields.category._id : formFields.category }
                    options={categories.map(cat => ({ value: cat.value?.toString(), label: cat.label }))}
                    placeholder="None"
                    onChange={(val) => {
                      setFormFields((prev) => ({
                        ...prev,
                        category: val,
                        subcategory: '',
                      }));
                      setSubcategory('');
                    }}
                  />
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SUB CATEGORY</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={formFields.subcategory || null}
                    onChange={(val) => {
                      setFormFields((prev) => ({ ...prev, subcategory: val }));
                      setSubcategory(val?.value || '');
                    }} options={subcategories} 
                    placeholder={ !formFields.category 
                      ? "Select Category": subcategories.length > 0 
                      ? "Select Subcategory" : "No SubCategory Found" }
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
                <input type="text" name="oldPrice" value={formFields.oldPrice || ""} onChange={inputChange}/>
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
                  <CustomDropdown value={ram} onChange={setRam} options={ramList} isMulti={true} placeholder="Select RAM" />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col">
              <div className="form-group">
                <h6>WEIGHT</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={weight} onChange={setWeight} options={weightList} isMulti={true} placeholder="Select Weight"/>
                </FormControl>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <h6>SIZE</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={size} onChange={setSize} options={sizeList} isMulti={true} placeholder="Select Size"/>
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
                  <Button className="btn-blue" type="button" disabled={addingUrl} onClick={handleImageUrlInput}> Add </Button>
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