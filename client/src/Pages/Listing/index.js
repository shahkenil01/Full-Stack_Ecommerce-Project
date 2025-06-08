import Sidebar from "../../Components/Sidebar";
import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { FaAngleDown } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import { useParams } from "react-router-dom";
import ProductItem from "../../Components/ProductItem";
import { useEffect, useState } from "react";
import { fetchDataFromApi } from "../../utils/api";

const Listing = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productView, setProductView] = useState('four');
    const openDropdown = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const [products, setProducts] = useState([]);
    const { id } = useParams();
    const path = window.location.pathname;

    const isSubCategory = path.includes('/subcat/');
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
      setIsLoading(true);
      fetchDataFromApi('/api/products').then(res => {
        if (Array.isArray(res)) {
            let filtered = res;

            if (isSubCategory) {
                filtered = res.filter(item => item.subcategory?._id === id);
            } else if (id) {
                filtered = res.filter(item => item.category?._id === id);
            }

            setProducts(filtered);
        }
        setIsLoading(false);
      });
    }, [id]);
    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                        <div className="productListing d-flex">
                            <Sidebar />

                            <div className="content_right">

                                <div className="showBy mt-3 mb-3 d-flex align-items-center">
                                    <div className="d-flex align-items-center btnWrapper">
                                        <Button className={productView==='one' && 'act'} onClick={()=>setProductView('one')}><IoIosMenu/></Button>
                                        <Button className={productView==='three' && 'act'} onClick={()=>setProductView('three')}><CgMenuGridR/></Button>
                                        <Button className={productView==='four' && 'act'} onClick={()=>setProductView('four')}><TfiLayoutGrid4Alt/></Button>
                                    </div>

                                    <div className="ml-auto showByFilter">
                                        <Button onClick={handleClick}>Show {itemsPerPage}<FaAngleDown/></Button>
                                        <Menu
                                            className="w-100 showPerPageDropdown"
                                            id="basic-menu"
                                            anchorEl={anchorEl}
                                            open={openDropdown}
                                            onClose={handleClose}
                                            MenuListProps={{
                                              'aria-labelledby': 'basic-button',
                                            }}
                                        >
                                            <MenuItem onClick={() => { setItemsPerPage(10); handleClose(); }}>10</MenuItem>
                                            <MenuItem onClick={() => { setItemsPerPage(20); handleClose(); }}>20</MenuItem>
                                            <MenuItem onClick={() => { setItemsPerPage(30); handleClose(); }}>30</MenuItem>
                                            <MenuItem onClick={() => { setItemsPerPage(40); handleClose(); }}>40</MenuItem>
                                            <MenuItem onClick={() => { setItemsPerPage(50); handleClose(); }}>50</MenuItem>
                                        </Menu>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="text-center mt-5" >
                                        <div
                                            className="spinner-border mt-5"
                                            role="status"
                                            style={{ width: '3rem', height: '3rem', color: '#000' }}>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                <div className="productListing">
                                    {products.slice(0, itemsPerPage).map((item) => (
                                        <ProductItem key={item._id} item={item} itemView={productView} />
                                    ))}
                                </div>
                                )}
                            </div>
                        </div>
                </div>
            </section>
        </>
    )
}

export default Listing;