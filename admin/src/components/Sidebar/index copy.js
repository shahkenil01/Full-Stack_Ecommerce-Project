import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa";
import { FaCartArrowDown } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { IoMdLogOut } from "react-icons/io";

const Sidebar = () => {

  const [activeTab, setActiveTab] = useState(0);
  const [isOpen, setIsOpen] = useState(Array(12).fill(false));

  const handleTabClick = (index) => {
    setActiveTab(index);
    setIsOpen(prev => prev.map((state, i) => i === index ? !state : false));
  };

  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 0 && 
              !location.pathname.startsWith('/products') && 
              !location.pathname.startsWith('/product/detail') && 
              !location.pathname.startsWith('/product/upload') ? 'active' : ''}`} onClick={() => handleTabClick(0)}>
              <span className='icon'><MdDashboard /></span>
              Dashboard
            </Button>
          </Link>
        </li>
        <li>
          <Button className={`w-100 ${isActive('/products') || isActive('/product/details') || isActive('/product/upload') || activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>
            <span className='icon'><FaProductHunt /></span>
            Products
            <span className={`arrow ${isOpen[1] ? 'rotate' : ''}`}><FaAngleRight /></span>
          </Button>
          <div className={`submenuWrapper ${isOpen[1] ? 'colapse' : 'colapsed'}`}>
            <ul className='submenu'>
              <li><Link to="/products">Product List</Link></li>
              <li><Link to="/product/details">Product View</Link></li>
              <li><Link to="/product/upload">Product Upload</Link></li>
            </ul>
          </div>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => handleTabClick(2)}>
              <span className='icon'><FaCartArrowDown /></span>
              Orders
              <span className={`arrow ${isOpen[2] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => handleTabClick(3)}>
              <span className='icon'><MdMessage /></span>
              Messages
              <span className={`arrow ${isOpen[3] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => handleTabClick(4)}>
              <span className='icon'><IoNotifications /></span>
              Notifications
              <span className={`arrow ${isOpen[4] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => handleTabClick(5)}>
              <span className='icon'><IoIosSettings /></span>
              Settings
              <span className={`arrow ${isOpen[5] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/login">
            <Button className={`w-100 ${activeTab === 6 ? 'active' : ''}`} onClick={() => handleTabClick(6)}>
              <span className='icon'><FaUser /></span>
              Login
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/signUp">
            <Button className={`w-100 ${activeTab === 7 ? 'active' : ''}`} onClick={() => handleTabClick(7)}>
              <span className='icon'><FaUser /></span>
              Sign Up
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 8 ? 'active' : ''}`} onClick={() => handleTabClick(8)}>
              <span className='icon'><FaCartArrowDown /></span>
              Orders
              <span className={`arrow ${isOpen[8] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 9 ? 'active' : ''}`} onClick={() => handleTabClick(9)}>
              <span className='icon'><MdMessage /></span>
              Messages
              <span className={`arrow ${isOpen[9] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => handleTabClick(10)}>
              <span className='icon'><IoNotifications /></span>
              Notifications
              <span className={`arrow ${isOpen[10] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/">
            <Button className={`w-100 ${activeTab === 11 ? 'active' : ''}`} onClick={() => handleTabClick(11)}>
              <span className='icon'><IoIosSettings /></span>
              Settings
              <span className={`arrow ${isOpen[11] ? 'rotate' : ''}`}><FaAngleRight /></span>
            </Button>
          </Link>
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
