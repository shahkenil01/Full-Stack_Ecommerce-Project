import { useState, useMemo } from "react";

import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import { IoIosTimer } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";

import { Menu, MenuItem, Button, FormControl, Pagination, Rating } from "@mui/material";

import DashboardBox from './components/dashboardBox';
import CustomDropdown from '../../components/CustomDropdown';

import { Chart } from "react-google-charts";

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showBy, setshowBy] = useState('');
  const [categoryBy, setCategoryBy] = useState('');
  const options = ['Last Day', 'Last Week', 'Last Month', 'Last Year'];
  
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const pieData = [
    ['Year', 'Sales'],
    ['2013', 25.9],
    ['2014', 30.3],
    ['2015', 17.1],
    ['2016', 26.7],
  ];

  const pieOptions = useMemo(() => ({
    legend: { position: 'right', textStyle: { color: '#fff', fontSize: 14 }},
    pieSliceText: 'percentage',
    pieSliceTextStyle: { fontSize: 14, color: '#fff' },
    slices: {
      0: { color: '#cb11ef' },
      1: { color: '#dc3912' },
      2: { color: '#ff9900' },
      3: { color: '#0d9815' },
    },
    backgroundColor: 'transparent',
    chartArea: { width: '100%', height: '100%' },
    tooltip: {
      trigger: 'focus',
      textStyle: { fontSize: 14, color: '#000' }
    },
  }), []);

  const renderMenuOptions = () => (
    options.map((option, index) => (
      <MenuItem key={index} onClick={handleClose}>
        <IoIosTimer style={{ marginRight: '8px' }} />
        {option}
      </MenuItem>
    ))
  );

  return (
    <div className="right-content w-100">
      <div className="row dashboardBoxWrapperRow">
        <div className="col-md-8">
          <div className="dashboardBoxWrapper d-flex">
            <DashboardBox color={["#1da256", "#48d483"]} icon={<FaUserCircle />} grow title="Total Users" value="277" />
            <DashboardBox color={["#c012e2", "#eb64fe"]} icon={<IoMdCart />} title="Total Orders" value="145" />
            <DashboardBox color={["#2c78e5", "#60aff5"]} icon={<MdShoppingBag />} title="Total Products" value="86" />
            <DashboardBox color={["#e1950e", "#f3cd29"]} icon={<GiStarsStack />} title="Total Reviews" value="312" />
          </div>
        </div>

        <div className="col-md-4 pl-0">
          <div className="box graphBox">
            <div className="d-flex align-items-center w-100 bottomEle">
              <h6 className="text-white mb-0 mt-0">Total Sales</h6>
              <div className="ml-auto">
                <Button className="ml-auto toggleIcon" onClick={handleClick}>
                  <HiDotsVertical />
                </Button>
                <Menu
                  id="long-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{  className: 'customMenuPaper', }}
                >
                  {renderMenuOptions()}
                </Menu>
              </div>
            </div>

            <h3 className="text-white font-weight-bold">₹3,787,681.00</h3>
            <p>₹3,578.90 in last month</p>

            <div style={{ width: '100%', height: '200px', position: 'relative' }}>
              <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={pieData}
                options={pieOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <h3 className="hd">Best Selling Products</h3>

        <div className="row cardFilters mt-3">
          <div className="col-md-3">
            <h4>SHOW BY</h4>
            <FormControl size="small" className="w-100">
              <CustomDropdown
                value={showBy}
                onChange={setshowBy}
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
                  <div class="d-flex align-items-center productBox">
                    <div class="imgWrapper">
                      <div class="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div class="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del class="old">₹210</del>
                    <span class="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div class="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span class="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div class="d-flex align-items-center productBox">
                    <div class="imgWrapper">
                      <div class="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div class="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del class="old">₹210</del>
                    <span class="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div class="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span class="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div class="d-flex align-items-center productBox">
                    <div class="imgWrapper">
                      <div class="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product"  className="w-100"/>
                      </div>
                    </div>
                    <div class="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del class="old">₹210</del>
                    <span class="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div class="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span class="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
              <tr>
                <td>#1</td>
                <td>
                  <div class="d-flex align-items-center productBox">
                    <div class="imgWrapper">
                      <div class="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="product" className="w-100"/>
                      </div>
                    </div>
                    <div class="info pl-3">
                      <h6>Tops and skirt set for Female...</h6>
                      <p>Women's exclusive summer Tops and skirt set for Female Tops and skirt set</p>
                    </div>
                  </div>
                </td>
                <td>Women</td>
                <td>richman</td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del class="old">₹210</del>
                    <span class="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>4.9(16)</td>
                <td>380</td>
                <td>₹38k</td>
                <td>
                  <div class="actions d-flex align-items-center">
                    <Button className='secondary' color="secondary"><FaEye/></Button>
                    <Button className='success' color="success"><FaPencilAlt/></Button>
                    <Button className='error' color="error"><MdDelete/></Button>
                  <span class="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex tableFooter" >
            <p>showing <b>12</b> of <b>60</b> results</p>
            <Pagination count={10} color="primary" className='pagination' showFirstButton showLastButton/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;