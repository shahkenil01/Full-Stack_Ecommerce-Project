import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useEffect, useState } from 'react';
import { Link,useParams, useNavigate } from 'react-router-dom';
import { fetchDataFromApi } from '../../utils/api';

const Sidebar = ({ priceRange, setPriceRange, statusFilter, setStatusFilter }) => {
    const [value, setValue] = useState([100, 70000]);
    const [value2, setValue2] = useState(0);

    const navigate = useNavigate();
    const { id: selectedSubId } = useParams();

    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        fetchDataFromApi('/api/subCat/').then(res => {
            if (Array.isArray(res)) {
                setSubcategories(res);
            }
        });
    }, []);
    return (
        <>
            <div className="sidebar">
            <div className='sticky'>
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>

                    <div className='scroll'>
                        <ul>
                            {subcategories.map((sub) => (
                                <li key={sub._id}>
                                    <FormControlLabel className='w-100'
                                      control={ <Checkbox checked={selectedSubId === sub._id}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                navigate(`/products/subcat/${sub._id}`);
                                            } else {
                                                navigate(-1);
                                            }
                                        }}/>
                                      }
                                    label={sub.subCat}/>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>FILTER BY PRICE</h6>

                    <RangeSlider value={priceRange} onInput={(val) => setPriceRange(val)} min={100} max={70000} step={5} />

                    <div className='d-flex pt-2 priceRange'>
                        <div><span>From: </span>
                            <input type="number" className="simple-input" value={priceRange[0]}
                                onChange={(e) => {
                                    const newMin = parseInt(e.target.value) || 0;
                                    const newMax = priceRange[1];
                                    if (newMin <= newMax) {
                                        setPriceRange([newMin, newMax]);
                                    }
                                }}
                            />
                        </div>
                        <div><span>To: </span>
                            <input type="number" className="simple-input" value={priceRange[1]}
                                onChange={(e) => {
                                    const newMax = parseInt(e.target.value) || 0;
                                    const newMin = priceRange[0];
                                    if (newMax >= newMin) {
                                        setPriceRange([newMin, newMax]);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>PRODUCT STATUS</h6>

                    <div className='scroll'>
                        <ul>
                            <li>
                                <FormControlLabel className='w-100' 
                                  control={<Checkbox checked={statusFilter === "inStock"} onChange={() => setStatusFilter("inStock")} />} 
                                  label="In Stok" />
                            </li>
                            <li>
                                <FormControlLabel className='w-100' 
                                  control={<Checkbox checked={statusFilter === "onSale"} onChange={() => setStatusFilter("onSale")} />} 
                                  label="On Sale" />
                            </li>
                        </ul>
                    </div>
                </div>

                <Link to='#'><img src='https://api.spicezgold.com/download/file_1734525757507_NewProject(34).jpg' className='w-100'/></Link>

            </div>
            </div>
        </>
    )
}

export default Sidebar;