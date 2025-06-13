import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSnackbar } from 'notistack';
import { postData, fetchDataFromApi, putData,deleteData } from '../../../utils/api';

const ProductsSize = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [size, setSize] = useState('');
  const [sizes, setSizes] = useState([]);
  const [originalSize, setOriginalSize] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchSizes = async () => {
    const res = await fetchDataFromApi('/api/sizes');
      if (Array.isArray(res?.data)) {
        setSizes(res.data);
      } else if (Array.isArray(res)) {
        setSizes(res);
      } else {
        setSizes([]);
      }
    };

  useEffect(() => {
    fetchSizes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!size.trim()) {
      enqueueSnackbar("Please fill the field", { variant: "error", preventDuplicate: true });
      return;
    }

    const token = localStorage.getItem("userToken");

    let res;
    if (editId) {
      if (size === originalSize) {
        enqueueSnackbar("Please change the value before updating", { variant: "error", preventDuplicate: true });
        return;
      }

      res = await putData(`/api/sizes/${editId}`, { name: size }, token);
    } else {
      res = await postData('/api/sizes', { name: size }, token);
    }

    if (!res || res.success === false) {
      if (res?.message) {
        enqueueSnackbar(res.message, { variant: "error", preventDuplicate: true });
      }
      return;
    }

    enqueueSnackbar(editId ? "Size updated successfully!" : "Size added successfully!", {
      variant: "success",
      preventDuplicate: true,
    });

    setEditId(null);
    setSize('');
    setOriginalSize('');
    fetchSizes();
  };

  const handleEditClick = (size) => {
    setEditId(size._id);
    setSize(size.name);
    setOriginalSize(size.name);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/sizes/${id}`, token);

    if (!res || res.success === false) return;

    enqueueSnackbar("Size deleted!", { variant: "success", preventDuplicate: true });
    fetchSizes();
  };

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

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>PRODUCT SIZE</h6>
                <input type="text" name="name" value={size}
                  onChange={(e) => setSize(e.target.value)}
                />
              </div>

              <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp; {editId ? 'UPDATE SIZE' : 'PUBLISH AND VIEW'}
              </Button>

              {editId && (
                <Button variant="outlined" color="secondary" className="w-100 mt-2"
                  onClick={() => { setEditId(null); setSize('');}}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="card p-4 mt-0" style={{ width: '55%' }}>
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>PRODUCT SIZE</th>
                <th width="25%">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map((sz) => (
                <tr key={sz._id}>
                  <td>{sz.name}</td>
                  <td>
                    <div className="actions d-flex align-items-center">
                      <Button className='success' color="success" onClick={() => handleEditClick(sz)}>
                        <FaPencilAlt />
                      </Button>
                      <Button className="error" color="error" onClick={() => handleDelete(sz._id)}>
                        <MdDelete />
                      </Button>
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

export default ProductsSize;