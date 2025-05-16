import { useState, useMemo } from "react";

import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { Button, FormControl, Pagination, Rating } from "@mui/material";

import DashboardBox from './components/dashboardBox';
import CustomDropdown from '../../components/CustomDropdown';

import SearchBox from "../../components/SearchBox";

const Dashboard = () => {
  const [categoryBy, setCategoryBy] = useState('');

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
                <th>UID</th>
                <th style={{ width: "300px" }}>PRODUCT</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>RATING</th>
                <th>ORDER</th>
                <th>SALES</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#1</td>
                <td>
                  <div className="d-flex align-items-center productBox">
                    <div className="imgWrapper">
                      <div className="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div className="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del className="old">₹210</del>
                    <span className="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div className="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span className="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div className="d-flex align-items-center productBox">
                    <div className="imgWrapper">
                      <div className="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div className="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del className="old">₹210</del>
                    <span className="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div className="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span className="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div className="d-flex align-items-center productBox">
                    <div className="imgWrapper">
                      <div className="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product"  className="w-100"/>
                      </div>
                    </div>
                    <div className="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del className="old">₹210</del>
                    <span className="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div className="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span className="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div className="d-flex align-items-center productBox">
                    <div className="imgWrapper">
                      <div className="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div className="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del className="old">₹210</del>
                    <span className="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div className="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span className="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="d-flex tableFooter" >
            <Pagination count={10} color="primary" className='pagination'/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;