import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight, FaProductHunt } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(Array(12).fill(false));
  const location = useLocation();

  const handleTabClick = (index) => {
    setActiveTab(index);
    setIsOpen(prev => prev.map((state, i) => i === index ? !state : false));
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const pathToTabIndex = {
    '/products': 1,
    '/product': 1,
    '/category': 2,
    '/subCategory': 2,
  };

  useEffect(() => {
    const found = Object.entries(pathToTabIndex).find(([prefix]) =>
      location.pathname.startsWith(prefix)
    );
    setActiveTab(found ? found[1] : 0);
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 0 && 'active'}`}
              onClick={() => handleTabClick(0)} >
              <span className='icon'><MdDashboard /></span>
              Dashboard
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/products"><Button className={`w-100 ${isActive('/products') || activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabClick(1)} >
            <span className='icon'><FaProductHunt /></span>
            Products
            <span className={`arrow ${isOpen[1] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button></Link>
          <div className={`submenuWrapper ${isOpen[1] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/products" className={location.pathname === '/products' ? 'active-submenu' : ''}>Product List</Link></li>
              <li><Link to="/product/upload" className={location.pathname === '/product/upload' ? 'active-submenu' : ''}>Product Upload</Link></li>
              <li><Link to="/productRAMS/add" className={location.pathname === '/productRAMS/add' ? 'active-submenu' : ''}>Add Product RAMS</Link></li>
              <li><Link to="/productWEIGHT/add" className={location.pathname === '/productWEIGHT/add' ? 'active-submenu' : ''}>Add Product WEIGHT</Link></li>
              <li><Link to="/productSIZE/add" className={location.pathname === '/productSIZE/add' ? 'active-submenu' : ''}>Add Product SIZE</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Link to="/category"><Button className={`w-100 ${isActive('/category') || activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabClick(2)} >
            <span className='icon'><TbCategoryFilled /></span>
            Category
            <span className={`arrow ${isOpen[2] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button></Link>
          <div className={`submenuWrapper ${isOpen[2] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/category" className={location.pathname === '/category' ? 'active-submenu' : ''}>Category List</Link></li>
              <li><Link to="/category/add" className={location.pathname === '/category/add' ? 'active-submenu' : ''}>Add a Category</Link></li>
              <li><Link to="/subCategory" className={location.pathname === '/subCategory' ? 'active-submenu' : ''}>Sub Category List</Link></li>
              <li><Link to="/subCategory/add" className={location.pathname === '/subCategory/add' ? 'active-submenu' : ''}>Add a Sub Category</Link></li>
            </ul>
          </div>
        </li>
      </ul>

      <div className='logoutWrapper'>
        <div className='logoutBox'>
          <Button variant="contained"><IoMdLogOut />Logout</Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;