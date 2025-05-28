import { Link } from 'react-router-dom';
import { FaPencilAlt } from "react-icons/fa";
import { IoMdHome } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';

const HomeBannerSlide = () => {
  const bannerList = [
    {
      _id: 1,
      image: "https://api.spicezgold.com/download/file_1734524878924_1721277298204_banner.jpg"
    },
    {
      _id: 2,
      image: "https://api.spicezgold.com/download/file_1734524878924_1721277298204_banner.jpg"
    },
    {
      _id: 3,
      image: "https://api.spicezgold.com/download/file_1734524878924_1721277298204_banner.jpg"
    }
  ];

  return (
    <div className="right-content w-100">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Home Banner Slide List</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
              <IoMdHome /> Dashboard
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Home Banner Slide
            </Typography>
          </Breadcrumbs>
          <Button className='btn-blue ml-3 pl-3 pr-3' component={Link} to="/homeBannerSlide/add">Add Home Slide</Button>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align page">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "20%" }}>IMAGE</th>
                <th style={{ width: "80%" }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {bannerList.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="d-flex align-items-center productBox" style={{ width: "100%" }}>
                      <div className="imgWrapper" style={{ width: "200%", flex: '0 0  200px' }}>
                        <div className="img card shadow m-0">
                          <img
                            src={item.image}
                            alt="Slide"
                            style={{ width: "100%", maxHeight: "120px", objectFit: "cover", borderRadius: "6px" }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="actions d-flex align-items-center justify-content-start gap-2">
                      <Button className='success' color="success"><FaPencilAlt /></Button>
                      <Button className='error' color="error"><MdDelete /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default HomeBannerSlide;