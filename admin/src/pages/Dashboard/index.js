import { useState, useEffect } from "react";

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
  const [productList, setProductList] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchDataFromApi("/api/products").then((res) => {
      setProductList(res || []);
    });
  }, []);

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
            <h4>CATEGORY BY</h4>
            <FormControl size="small" className="w-100">
              <CustomDropdown
                value={categoryBy}
                onChange={setCategoryBy}
                options={[
                  { value: '', label: 'None' },
                  { value: 10, label: 'Ten' },
                  { value: 20, label: 'Twenty' },
                  { value: 30, label: 'Thirty' }
                ]}
                placeholder="None"
              />
            </FormControl>
          </div>

          <div className="col-md-9 d-flex justify-content-end">
            <div className="searchWrap d-flex">
              <SearchBox />
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th>PRODUCT</th>
                <th style={{ width: "100px" }}>CATEGORY</th>
                <th style={{ width: "150px" }}>SUB CATEGORY</th>
                <th style={{ width: "120px" }}>BRAND</th>
                <th>PRICE</th>
                <th>RATING</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {productList?.length > 0 ? productList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) .map((item, index) => (
                <tr key={item._id}>
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
                  <td>Men Bags</td>
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
                      <Button className='secondary' color="secondary"><FaEye /></Button>
                      <Button className='success' color="success"><FaPencilAlt /></Button>
                      <Button className='error' color="error"><MdDelete /></Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10">No products found</td></tr>
              )}
            </tbody>
          </table>
          <TablePagination 
            component="div"
            count={productList.length} 
            page={page} onPageChange={(event, newPage) => setPage(newPage)} rowsPerPage={rowsPerPage} 
            onRowsPerPageChange={(event) => { setRowsPerPage(parseInt(event.target.value, 10));   setPage(0); }} 
            rowsPerPageOptions={[5, 10, 25]} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;