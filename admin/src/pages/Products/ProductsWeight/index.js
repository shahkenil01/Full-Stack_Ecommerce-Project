import { useState, useEffect } from 'react';
import { Breadcrumbs, Typography, Link as MuiLink, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaCloudUploadAlt, FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useSnackbar } from 'notistack';
import { postData, fetchDataFromApi, deleteData, putData } from '../../../utils/api';

const ProductsWeight = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [weight, setWeight] = useState('');
  const [weights, setWeights] = useState([]);
  const [originalWeight, setOriginalWeight] = useState('');
  const [editId, setEditId] = useState(null);

  const fetchWeights = async () => {
    const res = await fetchDataFromApi('/api/weights');
    if (res?.data) setWeights(res.data);
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weight.trim()) {
      enqueueSnackbar("Please fill the field", { variant: "error", preventDuplicate: true });
      return;
    }

    const token = localStorage.getItem("userToken");
    let res;

    if (editId) {
      if (weight === originalWeight) {
        enqueueSnackbar("Please change the value before updating", { variant: "error", preventDuplicate: true });
        return;
      }
      res = await putData(`/api/weights/${editId}`, { name: weight }, token);
    } else {
      res = await postData('/api/weights', { name: weight }, token);
    }

    if (!res || res.success === false) {
    enqueueSnackbar(res?.message || "Operation failed", { variant: "error", preventDuplicate: true });
      return;
    }

    enqueueSnackbar(editId ? "Weight updated successfully!" : "Weight added successfully!", {
      variant: "success", preventDuplicate: true
    });

    setEditId(null);
    setWeight('');
    setOriginalWeight('');
    fetchWeights();
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setWeight(item.name);
    setOriginalWeight(item.name);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("userToken");
    const res = await deleteData(`/api/weights/${id}`, token);

    if (!res || res.success === false) return;

    enqueueSnackbar("Weight deleted!", { variant: "success", preventDuplicate: true });
    fetchWeights();
  };

  return (
    <div className="right-content w-100 product-upload">

      <div className="card shadow border-0 w-100 flex-row p-4 align-items-center justify-content-between mb-4 breadcrumbCard">
        <h5 className="mb-0">Add Product WEIGHT</h5>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink component={Link} to="/" underline="hover" color="inherit" className="breadcrumb-link">
            <IoMdHome />Dashboard
          </MuiLink>
          <MuiLink component={Link} to="/products" underline="hover" color="inherit" className="breadcrumb-link">
            Product WEIGHT
          </MuiLink>
          <Typography className="breadcrumb-current" component="span" sx={{ padding: '6px 10px', borderRadius: '16px' }}>
            Add Product WEIGHT
          </Typography>
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-12">
            <div className="card p-4 mt-0">
              <div className="form-group">
                <h6>PRODUCT WEIGHT</h6>
                <input type="text" name="name" value={weight}
                  onChange={(e) => setWeight(e.target.value)}/>
              </div>

              <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                <FaCloudUploadAlt /> &nbsp; {editId ? 'UPDATE WEIGHT' : 'PUBLISH AND VIEW'}
              </Button>

              {editId && (
                <Button variant="outlined" color="secondary" className="w-100 mt-2"
                  onClick={() => { setEditId(null); setWeight(''); }}>
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
                <th>PRODUCT WEIGHT</th>
                <th width="25%">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((item) => (
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

export default ProductsWeight;