import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const [value, setValue] = useState([100, 100000]);
    const [value2, setValue2] = useState(0);
    return (
        <>
            <div className="sidebar">
            <div className='sticky'>
                <div className="filterBox">
                    <h6>PRODUCT CATEGORIES</h6>

                    <div className='scroll'>
                        <ul>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Men" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Women" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Laptops" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Smart Watch Accessories" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Cameras" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Men Bags" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Women Bags" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Men Footwear" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="Women FootWear" /></li>
                        </ul>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>FILTER BY PRICE</h6>

                    <RangeSlider value={value} onInput={setValue} min={100} max={100000} step={5} />

                    <div className='d-flex pt-2 priceRange'>
                        <span>From: <strong className='text-dark'>Rs: {value[0]}</strong></span>
                        <span className='ml-auto'>From: <strong className='text-dark'>Rs: {value[1]}</strong></span>
                    </div>
                </div>

                <div className="filterBox">
                    <h6>PRODUCT STATUS</h6>

                    <div className='scroll'>
                        <ul>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="In Stok" /></li>
                            <li><FormControlLabel className='w-100' control={<Checkbox />} label="On Sale" /></li>
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