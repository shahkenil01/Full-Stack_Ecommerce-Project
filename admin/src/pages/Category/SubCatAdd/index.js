import React, { useEffect, useState } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button, FormControl } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";

import { useSnackbar } from 'notistack';
import CustomDropdown from '../../../components/CustomDropdown';
import { fetchDataFromApi, postData } from '../../../utils/api';

const CategoryAdd = () => {
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  const [formFields, setFormFields] = useState({
    subCategory: '',
    category: ''
  });
  useEffect(() => {
    setFormFields((prev) => ({ ...prev, category }));
  }, [category]);


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

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subCategory, category } = formFields;
    const missing = [];

    if (!category) missing.push('parent category');
    if (!subCategory.trim()) missing.push('sub category');

    if (missing.length > 0) {
      enqueueSnackbar(`Please fill: ${missing.join(', ')}`, { variant: 'error' });
      return;
    }

    const payload = {
      subCat: subCategory.trim(),
      category,
    };

    setLoading(true);
    const token = localStorage.getItem("userToken");
    const result = await postData('/api/subCat/create', payload, token);
    setLoading(false);

    if (result?.success) {
      enqueueSnackbar('Sub Category created successfully!', { variant: 'success' });
      navigate("/subCategory");
    }
  };

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Sub Category</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/subCategory" underline="hover" color="inherit" className="breadcrumb-link">
            Sub Category
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Sub Category
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>Parent Category</h6>
                <FormControl size="small" className="w-100">
                  <CustomDropdown value={category} onChange={setCategory} options={categories} placeholder="None" />
                </FormControl>
              </div>

              <div className="form-group">
                <h6>Sub Category</h6>
                <input type="text" name="subCategory" value={formFields.subCategory} onChange={changeInput} />
              </div>

              <Button className="btn-blue btn-lg btn-big w-100" type="submit" disabled={loading}>
                <FaCloudUploadAlt /> &nbsp; {loading ? <span className="dot-loader"></span> : "PUBLISH AND VIEW"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CategoryAdd;