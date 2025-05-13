import { Link } from 'react-router-dom';

import DashboardBox from '../Dashboard/components/dashboardBox';
import CustomDropdown from '../../components/CustomDropdown';

import { FaUserCircle, FaEye, FaPencilAlt } from "react-icons/fa";
import { IoMdCart, IoMdHome } from "react-icons/io";
import { MdShoppingBag, MdDelete } from "react-icons/md";

import { Button, FormControl, Pagination,  Breadcrumbs, Typography, Link as MuiLink, Rating } from '@mui/material';

const Products = () => {
  const showBy = '';
  const categoryBy = '';

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
                onChange={() => {}}
                options={[
                  { value: '', label: 'All' },
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
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>SUB CATEGORY</th>
                <th>BRAND</th>
                <th>PRICE</th>
                <th>RATING</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="d-flex align-items-center productBox">
                    <div class="imgWrapper">
                      <div class="img card shadow m-0">
                        <img src="https://mironcoder-hotash.netlify.app/images/product/01.webp" alt="Product" className="w-100" />
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
                  <span class="badge badge-secondary">Lay's</span>
                </td>
                <td>
                  <div style={{ width: "70px" }}>
                    <del class="old">₹210</del>
                    <span class="new text-danger">₹200</span>
                  </div>
                </td>
                <td>
                  <Rating name="read-only-rating" value={4.5} precision={0.5} size="small" readOnly />
                </td>
                <td>
                  <div class="actions d-flex align-items-center">
                    <Link to="/product/details">
                      <Button className='secondary' color="secondary"><FaEye /></Button>
                    </Link>
                    <Button className='success' color="success"><FaPencilAlt /></Button>
                    <Button className='error' color="error"><MdDelete /></Button>
                    <span class="MuiTouchRipple-root css-w0pj6f"></span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="d-flex tableFooter">
            <Pagination count={10} color="primary" className='pagination'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
