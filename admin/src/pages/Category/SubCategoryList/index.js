import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { IoIosClose } from "react-icons/io";
import { fetchDataFromApi, deleteData } from '../../../utils/api';
import { useSnackbar } from 'notistack';

const Category = () => {

  const [subCategories, setSubCategories] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.toast) {
      enqueueSnackbar(location.state.toast.message, { variant: location.state.toast.type });
      navigate(location.pathname, { replace: true });
    }

    (async () => {
      const res = await fetchDataFromApi('/api/subCat');
      if (res) {
        setSubCategories(res);
      }
    })();
  }, []);

  const grouped = subCategories.reduce((acc, item) => {
    const catId = item.category._id;
    if (!acc[catId]) {
      acc[catId] = {
        name: item.category.name,
        image: item.category.images?.[0],
        subCats: [],
      };
    }
    acc[catId].subCats.push({ name: item.subCat, id: item._id });
    return acc;
  }, {});

  const handleDelete = async (id) => {
      const token = localStorage.getItem("userToken");
      const res = await deleteData(`/api/subCat/${id}`, token);

      if (res?.success) {
        setSubCategories((prev) => prev.filter((item) => item._id !== id));
        enqueueSnackbar("Sub Category deleted successfully!", { variant: "success" });
      }
  };

  return (
    <>
      <div className="right-content w-100">
        <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
          <h5 className="mb-0">Sub Category List</h5>
          <div className="d-flex align-items-center">
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
                <IoMdHome />Dashboard
              </MuiLink>
              <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
                Category
              </Typography>
            </Breadcrumbs>
            <Button className='btn-blue ml-3 pl-3 pr-3' component={Link} to="/subCategory/add">Add Sub Category</Button>
          </div>
        </div>

        <div className="card shadow border-0 p-3 mt-4">
          <div className="table-responsive mt-3">
            <table className="table table-bordered v-align page">
              <thead className="thead-dark ">
                <tr>
                  <th className='atimg' style={{ width: "100px" }}>CATEGORY IMAGE</th>
                  <th style={{ width: "170px" }}>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(grouped).length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                      No Sub Category Found
                    </td>
                  </tr>
                ) : (
                  Object.values(grouped).map((cat, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center productBox" style={{ width: "150px" }}>
                          <div className="imgWrapper" style={{ width: "50px", height: "50px" }}>
                            <div className="img card shadow m-0">
                              <img src={cat.image} alt={cat.name} />
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{cat.name}</td>
                      <td>
                        {cat.subCats.map((s) => (
                          <span className="badge badge-primary mx-1" key={s.id}>
                            {s.name}
                            <IoIosClose className="cursor" style={{ fontSize: '20px', marginTop: '-2px' }} onClick={() => handleDelete(s.id)} />
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;