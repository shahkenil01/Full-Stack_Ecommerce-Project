import { useState, useEffect } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSnackbar } from 'notistack';
import { postData, fetchDataFromApi, deleteData, putData } from '../../../utils/api';

const ProductsRam = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [ram, setRam] = useState('');
  const [rams, setRams] = useState([]);
  const [originalRam, setOriginalRam] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchRams = async () => {
    const res = await fetchDataFromApi('/api/rams');
    if (Array.isArray(res?.data)) {
      setRams(res.data);
    } else if (Array.isArray(res)) {
      setRams(res);
    } else {
      setRams([]);
    }
  };

  useEffect(() => {
    fetchRams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ram.trim()) {
      enqueueSnackbar("Please fill the field", { variant: "error" });
      return;
    }

    if (editId) {
      if (ram === originalRam) {
        enqueueSnackbar("Please change the value before updating", { variant: "error" });
        return;
      }
      const token = localStorage.getItem("userToken");
      const res = await putData(`/api/rams/${editId}`, { name: ram }, token);
      if (!res || res?.success === false) {
        return;
      }
        enqueueSnackbar("RAM updated successfully!", { variant: "success" });
        setEditId(null);
        setRam('');
        setOriginalRam('');
        fetchRams();
    } else {
      const token = localStorage.getItem("userToken");
      const res = await postData('/api/rams', { name: ram }, token);
      if (!res || res?.success === false) {
        return;
      }
        enqueueSnackbar("RAM added successfully!", { variant: "success" });
        setRam('');
        fetchRams();
    }
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setRam(item.name);
    setOriginalRam(item.name);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/rams/${id}`, token);

    if (!res || res.success === false) return;

    enqueueSnackbar("RAM deleted!", { variant: "success", preventDuplicate: true });
    fetchRams();
  };

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Product RAM</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link">
            Product RAM
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Product RAM
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>PRODUCT RAM</h6>
                <input type="text" name="name" value={ram}
                  onChange={(e) => setRam(e.target.value)}
                />
              </div>

              <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp; {editId ? 'UPDATE RAM' : 'PUBLISH AND VIEW'}
              </Button>

              {editId && (
                <Button variant="outlined" color="secondary" className="w-100 mt-2"
                  onClick={() => { setEditId(null); setRam('');}}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>

      <div className="card p-4 mt-0" style={{ width: '55%' }}>
        <div className='table-responsive mt-3'>
          <table className="table table-bordered table-striped v-align">
            <thead className="thead-dark">
              <tr>
                <th>PRODUCT RAM</th>
                <th width="25%">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rams.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>
                    <div className="actions d-flex align-items-center gap-2">
                      <Button className='success' color="success" onClick={() => handleEditClick(item)}>
                        <FaPencilAlt />
                      </Button>
                      <Button className='error' color="error" onClick={() => handleDelete(item._id)}>
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

export default ProductsRam;