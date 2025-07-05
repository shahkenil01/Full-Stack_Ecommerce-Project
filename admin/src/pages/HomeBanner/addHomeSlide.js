import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Breadcrumbs, Typography, Link as MuiLink } from '@mui/material';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaRegImage } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { MyContext } from "../../App";
import { useSnackbar } from "notistack";
import { postData } from "../../utils/api";

const AddHomeSlide = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [inputType, setInputType] = useState("url");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageData, setImageData] = useState([]);
  const context = useContext(MyContext);
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setImageData([]);
  }, []);

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url || imageData.some((img) => img.src === url)) return;
    setImageData((prev) => [...prev, { src: url, type: 'url' }]);
    setImageUrlInput('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const selected = files
      .filter((file) => allowed.includes(file.type))
      .map((file) => ({
        src: URL.createObjectURL(file),
        file,
        type: "file",
      }));

    setImageData((prev) => [...prev, ...selected]);
  };

  const removeImage = (index) => {
    setImageData((prev) => prev.filter((_, i) => i !== index));
  };

  const addHomeSlide = async (e) => {
    e.preventDefault();

    if (imageData.length === 0) {
      enqueueSnackbar("Please upload at least one image", { variant: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const toBase64 = file =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

      const encodedImages = await Promise.all(
        imageData.map(async (img) => {
          if (img.type === "url") return img.src;
          if (img.type === "file") return await toBase64(img.file);
          return "";
        })
      );

      const token = localStorage.getItem("userToken");
      const result = await postData("/api/homeBanner/create", { images: encodedImages }, token);

      if (result?.success) {
        enqueueSnackbar("Slide created successfully!", { variant: "success" });
        history("/homeBannerSlide/list");
      } else {
        enqueueSnackbar(result?.message || "Something went wrong!", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Upload failed!", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Home Slide</h5>
        <div className="d-flex align-items-center">
          <Breadcrumbs aria-label="breadcrumb">
            <MuiLink component={Link} underline="hover" color="inherit" to="/" className="breadcrumb-link">
              <IoMdHome />Dashboard
            </MuiLink>
            <MuiLink component={Link} to="/homeBannerSlide/list" underline="hover" color="inherit" className="breadcrumb-link">
              Home Banner List
            </MuiLink>
            <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
              Add Home Banner
            </Typography>
          </Breadcrumbs>
        </div>
      </div>

      <form className="form" onSubmit={addHomeSlide}>
        <div className="row">
          <div className="col-sm-9">
            <div className="card p-4 mt-0">
              <div className="imagesUploadSec">
                <h5 className="mb-4">Media And Published</h5>

                <div className="form-group-radio mt-2">
                  <h6>Image Input Type</h6>
                  <div className="mt-3">
                    <label>
                      <input type="radio" value="url" checked={inputType === 'url'} onChange={() => setInputType('url')} /> Image URL
                    </label>
                    &nbsp;&nbsp;
                    <label>
                      <input type="radio" value="file" checked={inputType === 'file'} onChange={() => setInputType('file')} /> Upload Image
                    </label>
                  </div>
                </div>

                {inputType === "url" && (
                  <div className="form-group mb-0 mt-2">
                    {imageData.length === 0 && (
                      <div className="position-relative inputBtn">
                        <input
                          type="text"
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          placeholder="Enter image URL"
                          style={{ paddingRight: '80px' }}
                        />
                        <Button className="btn-blue" type="button" onClick={addImageUrl}> Add </Button>
                      </div>
                    )}
                  </div>
                )}

                <div className="imgUploadBox d-flex align-items-center flex-wrap gap-3 mb-3">
                  {imageData.map((img, i) => (
                    <div className="uploadBox advance" key={i}>
                      <span className="remove" onClick={() => removeImage(i)}>
                        <IoCloseSharp />
                      </span>
                      <div className="box">
                        <img src={img.src} alt={`preview-${i}`} className="w-100 preview" />
                      </div>
                    </div>
                  ))}

                  {inputType === "file" && imageData.length === 0 && (
                    <div className="uploadBox">
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                      <div className="info">
                        <FaRegImage />
                        <h5>image upload</h5>
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="btn-blue btn-lg btn-big w-100 mt-1" disabled={isLoading}>
                  <FaCloudUploadAlt /> &nbsp;
                  {isLoading ? <span className="dot-loader"></span> : "PUBLISH AND VIEW"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHomeSlide;
