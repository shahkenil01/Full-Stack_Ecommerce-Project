import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, FormControl, Rating, TablePagination } from "@mui/material";
import { fetchDataFromApi } from "../../utils/api";
import DashboardBox from './components/dashboardBox';
import CustomDropdown from '../../components/CustomDropdown';
import SearchBox from "../../components/SearchBox";

const Dashboard = () => {
  const [categoryBy, setCategoryBy] = useState('');
  const [categories, setCategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [prevFilteredCount, setPrevFilteredCount] = useState(0);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    fetchDataFromApi("/api/products").then((res) => {
      setProductList(res || []);
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

  const filteredProducts = Array.isArray(productList) ? productList.filter((item) => {
      const matchCategory = categoryBy ? item.category?._id === categoryBy : true;
      const matchSearch = item.name?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    }) : [];

  useEffect(() => {
    if (page > 0 && filteredProducts.length <= page * rowsPerPage) {
      setPage(0);
    }
    setPrevFilteredCount(filteredProducts.length);
  }, [filteredProducts.length]);
  useEffect(() => {
    setPage(0);
  }, [categoryBy, searchQuery]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/products/${id}`, token);
  
    if (!res || res.success === false) return;
    enqueueSnackbar("Product deleted successfully!", { variant: "success" });
      
    const updated = await fetchDataFromApi("/api/products");
    setProductList(Array.isArray(updated) ? updated : (updated?.productList || []));
  };

  return (
    <div className="right-content home w-100">
      <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
        <div className="col-md-12">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow title="Total Users" value="277" noFooter={true}/>
            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} title="Total Orders" value="145" noFooter={true}/>
            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Total Products" value="86" noFooter={true}/>
            <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} title="Total Reviews" value="312" noFooter={true}/>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <h3 className="hd">Best Selling Products</h3>

        <div className="row cardFilters mt-3">
          <div className="col-md-3">
            <h4 className="dashCat">CATEGORY BY</h4>
            <FormControl size="small" className="w-100">
              <CustomDropdown
                value={categoryBy}
                onChange={setCategoryBy}
                options={[{ value: '', label: 'All' }, ...(Array.isArray(categories) ? categories.map(cat => ({
                  value: cat._id,
                  label: cat.name
                })) : [])
                ]}
                placeholder="None"
              />
            </FormControl>
          </div>

          <div className="col-md-9 d-flex justify-content-end">
            <div className="searchWrap d-flex">
              <SearchBox value={searchQuery} onChange={setSearchQuery}/>
            </div>
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
              {productList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-2.5"> No products found in database. </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-2.5"> No products found for this filter. </td>
                </tr>
              ) : ( filteredProducts
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
                  <td>{item.subcategory?.subCat || "No Subcategory"}</td>
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
              ))
            )}
            </tbody>
          </table>
        </div>
        <TablePagination className='mt-3' style={{ marginBottom: '-20px' }} component="div" count={filteredProducts.length} page={page} 
          onPageChange={(event, newPage) => setPage(newPage)} 
          rowsPerPage={rowsPerPage} 
          onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10));   setPage(0); }} 
          rowsPerPageOptions={[50, 100, 150,200]} 
        />
      </div>
    </div>
  );
};

export default Dashboard;