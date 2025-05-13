import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const ProductsRam = () => {

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Product SIZE</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link">
            Product SIZE
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Product SIZE
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form">
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>PRODUCT SIZE</h6>
                <input type="text" name="name"/>
              </div>

              <Button className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp; PUBLISH AND VIEW
              </Button>
            </div>
          </div>
        </div>
      </form>
      <div className="card p-4 mt-0" style={{ width: '55%'}}>
        <div className='table-responsive mt-3'>
          <table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>PRODUCT SIZE</th>
                <th width="25%">ACTION</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>S</td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button className='success' color="success"><FaPencilAlt /></Button>
                      <Button className='error' color="error"><MdDelete /></Button>
                    </div>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsRam;