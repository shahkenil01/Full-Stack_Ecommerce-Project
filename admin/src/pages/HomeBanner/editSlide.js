import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImages } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import { useSnackbar } from "notistack";
import { fetchDataFromApi, putData } from "../../utils/api";

const EditHomeSlide = () => {
  const { id } = useParams();
  const history = useNavigate();
  const context = useContext(MyContext);
  const { enqueueSnackbar } = useSnackbar();

  const [inputType, setInputType] = useState("url");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageData, setImageData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDataFromApi(`/api/homeBanner/${id}`).then((res) => {
      if (res?.image) {
        setImageData([{ src: res.image, type: "url" }]);
        setInputType("url");
      }
    });
  }, [id]);

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;
    setImageData([{ src: url, type: "url" }]); // overwrite
    setImageUrlInput("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setImageData([{ src, type: "file", file }]); // overwrite
  };

  const removeImage = () => {
    setImageData([]);
    setImageUrlInput("");
  };

  const updateSlide = async (e) => {
    e.preventDefault();

    if (imageData.length !== 1) {
      enqueueSnackbar("Only one image is allowed!", { variant: "error" });
      return;
    }

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });

    const finalData = { images: [] };

    if (imageData[0].type === "url") {
      finalData.images = [imageData[0].src];
    } else if (imageData[0].type === "file") {
      finalData.images = [await toBase64(imageData[0].file)];
    }

    setLoading(true);
    const token = localStorage.getItem("userToken");
    const res = await putData(`/api/homeBanner/${id}`, finalData, token);
    setLoading(false);

    if (res?.success || res?.message?.includes("updated")) {
      enqueueSnackbar("Slide updated successfully!", { variant: "success" });
      history("/homeBannerSlide/list");
    } else {
      enqueueSnackbar(res?.message || "Update failed!", { variant: "error" });
    }
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Edit Home Slide</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome /> Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/homeBannerSlide/list" underline="hover" color="inherit" className="breadcrumb-link">
            Home Banner List
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Edit Slide
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={updateSlide}>
        <div className="row">
          <div className="col-sm-9">
            <div className="card p-4 mt-0">
              <div className="imagesUploadSec">
                <h5 className="mb-4">Media And Published</h5>

                <div className="form-group-radio mt-2 mb-2">
                  <h6>Image Input Type</h6>
                  <label>
                    <input
                      type="radio"
                      value="url"
                      checked={inputType === "url"}
                      onChange={() => setInputType("url")}
                    />
                    &nbsp;Image URL
                  </label>
                  &nbsp;&nbsp;
                  <label>
                    <input
                      type="radio"
                      value="file"
                      checked={inputType === "file"}
                      onChange={() => setInputType("file")}
                    />
                    &nbsp;Upload Image
                  </label>
                </div>

                {inputType === "url" && (
                  <div className="form-group mb-2">
                    <div className="position-relative inputBtn">
                      <input
                        type="text"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="Enter image URL"
                        style={{ paddingRight: '80px' }}
                      />
                      <Button className="btn-blue" type="button" onClick={addImageUrl}>
                        Add
                      </Button>
                    </div>
                  </div>
                )}

                <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mt-3 mb-2">
                  {imageData.map((img, i) => (
                    <div className="uploadBox advance" key={i}>
                      <span className="remove" onClick={removeImage}>
                        <IoCloseSharp />
                      </span>
                      <div className="box">
                        <img className="w-100" src={img.src} alt={`preview-${i}`} />
                      </div>
                    </div>
                  ))}

                  {inputType === "file" && (
                    <div className="uploadBox">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      <div className="info">
                        <FaRegImages />
                        <h5>image upload</h5>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="btn-blue btn-lg btn-big w-100 mt-1" disabled={loading}>
                  <FaCloudUploadAlt /> &nbsp;
                  {loading ? <span className="dot-loader"></span> : "PUBLISH AND VIEW"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditHomeSlide;
