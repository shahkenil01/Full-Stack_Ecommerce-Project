import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { MdDashboard } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import { FaAngleRight, FaProductHunt } from "react-icons/fa";
import { TbCategoryFilled } from "react-icons/tb";
import { FaClipboardCheck } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(Array(12).fill(false));
  const location = useLocation();

  const handleTabClick = (index) => {
    setIsOpen((prev) =>
      prev.map((state, i) => i === index ? !state : false)
    );
  };

  const isActive = (path) => location.pathname.startsWith(path);

  const pathToTabIndex = {
    '/category': 2,
    '/subCategory': 2,
    '/products': 3,
    '/product': 3,
  };

  useEffect(() => {
    const found = Object.entries(pathToTabIndex).find(([prefix]) =>
      location.pathname.startsWith(prefix)
    );
    const tabIndex = found ? found[1] : 0;
    setActiveTab(tabIndex);
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
          <Button className={`w-100 ${activeTab === 1 && 'active'}`}
            onClick={() => handleTabClick(1)} >
            <span className='icon'><IoImageOutline /></span>
            Home Banner Slides
            <span className={`arrow ${isOpen[1] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[1] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/homeBannerSlide/add" className={location.pathname === '/homeBannerSlide/add' ? 'active-submenu' : ''}>Add Home Banner Slide</Link></li>
              <li><Link to="/homeBannerSlide/list" className={location.pathname === '/homeBannerSlide/list' ? 'active-submenu' : ''}>Home Banner Slide</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabClick(2)} >
            <span className='icon'><TbCategoryFilled /></span>
            Category
            <span className={`arrow ${isOpen[2] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[2] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/category" className={location.pathname === '/category' ? 'active-submenu' : ''}>Category List</Link></li>
              <li><Link to="/category/add" className={location.pathname === '/category/add' ? 'active-submenu' : ''}>Add a Category</Link></li>
              <li><Link to="/subCategory" className={location.pathname === '/subCategory' ? 'active-submenu' : ''}>Sub Category List</Link></li>
              <li><Link to="/subCategory/add" className={location.pathname === '/subCategory/add' ? 'active-submenu' : ''}>Add a Sub Category</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => handleTabClick(3)} >
            <span className='icon'><FaProductHunt /></span>
            Products
            <span className={`arrow ${isOpen[3] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[3] ? 'colapse' : 'colapsed'}`}>
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
          <Link to="/orders">
            <Button className={`w-100 ${activeTab === 4 && 'active'}`}
              onClick={() => handleTabClick(4)} >
              <span className='icon'><FaClipboardCheck /></span>
              Orders
            </Button>
          </Link>
        </li>
        <li>
          <Button className={`w-100 ${activeTab === 5 && 'active'}`}
            onClick={() => handleTabClick(5)} >
            <span className='icon'><IoImageOutline /></span>
            Home Banners
            <span className={`arrow ${isOpen[5] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[5] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/banners" className={location.pathname === '/banners' ? 'active-submenu' : ''}>Banner List</Link></li>
              <li><Link to="/banners/add" className={location.pathname === '/banners/add' ? 'active-submenu' : ''}>Banner Upload</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Button className={`w-100 ${activeTab === 6 && 'active'}`}
            onClick={() => handleTabClick(6)} >
            <span className='icon'><IoImageOutline /></span>
            Home Side Banners
            <span className={`arrow ${isOpen[6] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[6] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/homeSideBanners" className={location.pathname === '/homeSideBanners' ? 'active-submenu' : ''}>Banner List</Link></li>
              <li><Link to="/homeSideBanners/add" className={location.pathname === '/homeSideBanners/add' ? 'active-submenu' : ''}>Banner Upload</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Button className={`w-100 ${activeTab === 7 && 'active'}`}
            onClick={() => handleTabClick(7)} >
            <span className='icon'><IoImageOutline /></span>
            Home Bottom Banners
            <span className={`arrow ${isOpen[7] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[7] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/homeBottomBanners" className={location.pathname === '/homeBottomBanners' ? 'active-submenu' : ''}>Banner List</Link></li>
              <li><Link to="/homeBottomBanners/add" className={location.pathname === '/homeBottomBanners/add' ? 'active-submenu' : ''}>Banner Upload</Link></li>
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