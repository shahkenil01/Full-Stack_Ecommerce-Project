import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart, IoMdHome } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { Button, FormControl, Rating, TablePagination, Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import DashboardBox from '../Dashboard/components/dashboardBox';
import { fetchDataFromApi, deleteData } from '../../utils/api';
import CustomDropdown from '../../components/CustomDropdown';
import { useSnackbar } from 'notistack';

const Products = () => {
  const [categoryBy, setCategoryBy] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchDataFromApi("/api/products").then((res) => {
      setProductList(Array.isArray(res) ? res : (res?.productList || []));
    });
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      enqueueSnackbar(location.state.toast.message, { variant: location.state.toast.type });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state, enqueueSnackbar]);

  const handleDelete = async (id) => {
    const res = await deleteData(`/api/products/${id}`);
    if (res?.message === "Product deleted successfully") {
      const updated = await fetchDataFromApi("/api/products");
      setProductList(Array.isArray(updated) ? updated : (updated?.productList || []));
      enqueueSnackbar("Product deleted successfully!", { variant: "success" });
    } else {
      enqueueSnackbar(res?.message || "Failed to delete product.", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchDataFromApi("/api/SubCat").then((res) => {
      const allSubs = Array.isArray(res) ? res : [];
      setSubcategories(allSubs);
    });
  }, []);

  useEffect(() => {
    (async () => {
      let page = 1, all = [], hasMore = true;
      while (hasMore) {
        const res = await fetchDataFromApi(`/api/category?page=${page}`);
        hasMore = res?.categoryList?.length > 0 && page < res.totalPages;
        all.push(...(res?.categoryList || []));
        page++;
      }
      setCategories(all);
    })();
  }, []);

  const filteredProducts = productList.filter((item) =>
    categoryBy ? item.category?._id === categoryBy : true
  );

  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Product List</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
              <IoMdHome/>Dashboard
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Products
            </Typography>
          </Breadcrumbs>
          <Button className='btn-blue ml-3 pl-3 pr-3' component={Link} to="/product/upload">Add Product</Button>
        </div>
      </div>

      <div className="full-width-dashboardBoxWrapper">
        <div className="dashboardBoxWrapper d-flex w-100" style={{ gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} title="Total Users" value="277" noFooter={true}/>
          </div>
          <div style={{ flex: 1 }}>
            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} title="Total Orders" value="145" noFooter={true}/>
          </div>
          <div style={{ flex: 1 }}>
            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Total Products" value="86" noFooter={true}/>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <h3 className="hd">Best Selling Products</h3>

        <div className="row cardFilters mt-3">
          <div className="col-md-3">
            <h4>CATEGORY BY</h4>
            <FormControl size="small" className="w-100">
              <CustomDropdown
                value={categoryBy}
                onChange={(value) => {
                  setCategoryBy(value);
                  setPage(0);
                }}
                options={[{ value: '', label: 'All' },...categories.map((cat) => ({
                  value: cat._id,
                  label: cat.name
                }))]}
                placeholder="None"
              />
            </FormControl>
          </div>
        </div>

        <div className="table-responsive fixedheight mt-3">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "50px" }}>NO.</th>
                <th>PRODUCT</th>
                <th style={{ width: "100px" }}>CATEGORY</th>
                <th style={{ width: "150px" }}>SUB CATEGORY</th>
                <th style={{ width: "130px" }}>BRAND</th>
                <th style={{ width: "50px" }}>PRICE</th>
                <th style={{ width: "100px" }}>RATING</th>
                <th style={{ width: "120px" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? filteredProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <tr key={item._id}>
                    <td>{item.indexNumber}</td>
                    <td>
                      <div className="d-flex align-items-center productBox">
                        <div className="imgWrapper">
                          <div className="img card border shadow m-0">
                            <img src={item.images[0]} alt={item.name} className="w-100" />
                          </div>
                        </div>
                        <div className="info pl-3">
                          <h6>{item.name}</h6>
                          <p>{item.description}</p>
                        </div>
                      </div>
                    </td>
                    <td>{item.category?.name || "No Category"}</td>
                    <td>{item.subcategory?.subCat || 'No Subcategory'}</td>
                    <td><span className="badge badge-secondary">{item.brand}</span></td>
                    <td>
                      <div style={{ width: "70px" }}>
                        <del className="old">₹{item.oldPrice || "0"}</del>
                        <span className="new text-danger">₹{item.price || "0"}</span>
                      </div>
                    </td>
                    <td>
                      <Rating name="read-only-rating" value={item.rating || 0} precision={0.5} size="small" readOnly />
                    </td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Link to="/product/details">
                          <Button className='secondary' color="secondary"><FaEye /></Button>
                        </Link>
                        <Link to={`/product/edit/${item._id}`}>
                          <Button className='success' color="success"><FaPencilAlt /></Button>
                        </Link>
                        <Button className='error' color="error" onClick={() => handleDelete(item._id)}><MdDelete /></Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8" className="text-center">No products found.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination className='mt-3' style={{ marginBottom: '-20px' }} component="div" count={filteredProducts.length} page={page}
          onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[50, 100, 150, 200]}
        />
      </div>
    </div>
  );
};

export default Products;
