import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { IoIosClose } from "react-icons/io";

const Category = () => {
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
                  <th style={{ width: "100px" }}>CATEGORY IMAGE</th>
                  <th style={{ width: "170px" }}>CATEGORY</th>
                  <th>SUB CATEGORY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="d-flex align-items-center productBox" style={{ width: "150px" }}>
                      <div className="imgWrapper" style={{ width: "50px", height: "50px" }}>
                        <div className="img card shadow m-0">
                          <img src="https://api.spicezgold.com/download/file_1734525204708_fash.png" alt="Category" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>Fashion</td>
                  <td>
                    <span className='badge badge-primary mx-1'> 
                      Men  <IoIosClose className="cursor" style={{fontSize:'20px', marginTop:'-2px'}}/> 
                    </span>
                    <span className='badge badge-primary mx-1'> 
                      Women <IoIosClose className="cursor" style={{fontSize:'20px', marginTop:'-2px'}}/> 
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;