import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPencilAlt } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Button, Breadcrumbs, Typography, Link as MuiLink, Pagination } from '@mui/material';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import { useSnackbar } from 'notistack';

const Category = () => {

  const [catData, setCatData] = useState([]);
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi('/api/category').then((res) => {
      if (res?.categoryList && Array.isArray(res.categoryList)) {
        setCatData(res);
      } else {
        console.error("Failed to fetch categories:", res);
        setCatData({ categoryList: [], totalPages: 1, page: 1 });
      }
    });
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      enqueueSnackbar(location.state.toast.message, { variant: location.state.toast.type });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, enqueueSnackbar]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/category/${id}`, token);
    if (res?.success || res?.message === 'Category and images deleted!') {
      const currentPage = catData.page;
      const totalItems = catData.categoryList.length - 1;
      const perPage = 4;
  
      const newPage = totalItems === 0 && currentPage > 1 ? currentPage - 1 : currentPage;
  
      const updated = await fetchDataFromApi(`/api/category?page=${newPage}`);
      setCatData(updated);
      
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
    } 
  };  

  const handleChange = (event, value) => {
    fetchDataFromApi(`/api/category?page=${value}`).then((res) => {
      setCatData(res);
    })
  }

  return (
  <>
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Category List</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
              <IoMdHome/>Dashboard
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Category
            </Typography>
          </Breadcrumbs>
          <Button className='btn-blue ml-3 pl-3 pr-3' component={Link} to="/category/add">Add Category</Button>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">

        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "15%" }}>IMAGE</th>
                <th style={{ width: "35%" }}>CATEGORY</th>
                <th style={{ width: "25%" }}>COLOR</th>
                <th style={{ width: "25%" }}>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {catData?.categoryList?.length !== 0 && catData?.categoryList?.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center productBox" style={{ width: "150px" }}>
                        <div className="imgWrapper" style={{ width: "50px", height: "50px" }}>
                          <div className="img card shadow m-0">
                            <img
                              src={item.images[0]}
                              alt="Product"
                              style={{ height: "100%", objectFit: "cover", borderRadius: "6px" }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.color}</td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Link to={`/category/edit/${item._id}`}><Button className='success' color="success"><FaPencilAlt /></Button></Link>
                        <Button className='error' color="error" onClick={() => handleDelete(item._id)}><MdDelete /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
          <div className="d-flex tableFooter">
            <Pagination count={catData?.totalPages} color="primary" className='pagination' onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
</>
  );
};

export default Category;
