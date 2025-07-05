import { useContext, useEffect, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import { Link, useLocation } from "react-router-dom";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { IoMdHome } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSnackbar } from "notistack";
import { fetchDataFromApi, deleteData } from "../../utils/api";
import "react-lazy-load-image-component/src/effects/blur.css";

const HomeSlidesList = () => {
  const context = useContext(MyContext);
  const [slideList, setSlideList] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetchDataFromApi("/api/homeBanner");
      if (res && Array.isArray(res)) {
        setSlideList(res);
      } else {
        enqueueSnackbar("No banner data found", { variant: "warning" });
      }
    } catch (err) {
      enqueueSnackbar("Error fetching banners", { variant: "error" });
    }
  };

  useEffect(() => {
    if (location.state?.toast) {
      enqueueSnackbar(location.state.toast.message, { variant: location.state.toast.type });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, enqueueSnackbar]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/homeBanner/${id}`, token);
    if (res?.success || res?.message === "Banner deleted") {
      const updated = slideList.filter((item) => item._id !== id);
      setSlideList(updated);
      enqueueSnackbar("Slide deleted successfully!", { variant: "success" });
    } else {
      enqueueSnackbar(res?.message || "Delete failed", { variant: "error" });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Home Banner Slide List</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
              <IoMdHome />Dashboard
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Home Slide
            </Typography>
          </Breadcrumbs>
          <Button className='btn-blue ml-3 pl-3 pr-3' component={Link} to="/homeBannerSlide/add">Add Home Slide</Button>
        </div>
      </div>

      <div className="card shadow border-0 p-3 mt-4">
        <div className="table-responsive mt-3">
          <table className="table table-bordered v-align">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: "230px" }}>IMAGE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {slideList.length === 0 ? (
                <tr><td colSpan="2" className="text-center">No slides available</td></tr>
              ) : (
                slideList.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      <div className="d-flex align-items-center productBox" style={{ width: "150px" }}>
                        <div className="imgWrapper custom-img-fix">
                          <div className="img card shadow m-0">
                            <img src={item.image} alt="Banner" className="w-100" />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="actions d-flex align-items-center">
                        <Link to={`/homeBannerSlide/edit/${item._id}`}>
                          <Button className="success" color="success">
                            <FaPencilAlt />
                          </Button>
                        </Link>
                        <Button className="error" color="error" onClick={() => handleDelete(item._id)}>
                          <MdDelete />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HomeSlidesList;
