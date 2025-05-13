import React, { useState } from "react";
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import Button from '@mui/material/Button';
import { MdMenuOpen } from 'react-icons/md';
import { MdOutlineMenu } from 'react-icons/md';
import SearchBox from '../SearchBox';
import { MdOutlineLightMode } from 'react-icons/md';
import { IoIosMoon } from "react-icons/io";
import { FaRegBell } from 'react-icons/fa6';
import { Menu, MenuItem, ListItemIcon, Divider} from "@mui/material";
import { Logout, PersonAdd } from "@mui/icons-material";
import { IoShieldHalfSharp } from "react-icons/io5";
import { useContext } from "react";
import { MyContext } from '../../App';
import UserAvatarImgComponent from "../userAvatarImg";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const openMyAcc = Boolean(anchorEl);
  const openNotifications = Boolean(notificationAnchorEl);

  const context = useContext(MyContext)

  const handleOpenMyAccDrop = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMyAccDrop = () => {
    setAnchorEl(null);
  };

  const handleOpennotificationsDrop = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleClosenotificationsDrop = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <>
      <header className="d-flex align-items-center">
        <div className="container-fluid w-100">
          <div className="row d-flex align-items-center w-100">
            
            <div className="col-sm-2 part1">
              <Link to={'/'} className="d-flex align-items-center logo">
                <img src={logo} alt="logo" />
                <span className="ml-2">HOTASH</span>
              </Link>
            </div>

            <div className="col-sm-3 d-flex align-items-center part2">
              <Button className="rounded-circle mr-3" onClick={()=>context.setIsToggleSidebar(!context.isToggleSidebar)}>
                {
                  context.isToggleSidebar===false ? <MdMenuOpen /> : <MdOutlineMenu/>
                }
              </Button>
              <SearchBox />
            </div>

            <div className="col-sm-7 d-flex align-items-center justify-content-end part3">

              <Button className="rounded-circle mr-3" onClick={()=>context.setThemeMode(!context.themeMode)}> 
                {context.themeMode ? <MdOutlineLightMode /> : <IoIosMoon />}
              </Button>
              <Button className="rounded-circle mr-3" onClick={handleOpennotificationsDrop}> <FaRegBell /> </Button>

              <div className='dropdownWrapper position-relative'>
                <Menu
                  anchorEl={notificationAnchorEl}
                  className="notifications dropdown_list"
                  id="notifications"
                  open={openNotifications}
                  onClose={handleClosenotificationsDrop}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <div className='head pl-3 pb-0'>
                    <h4>Orders (12)</h4>
                  </div>
                  <Divider className="mb-1"/>
                  <div className="scroll">
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  <MenuItem onClick={handleClosenotificationsDrop}>
                    <div className='d-flex'>
                      <div>
                        <div className="userImg">
                          <span className='rounded-circle'>
                            <img src="https://mironcoder-hotash.netlify.app/images/avatar/01.webp" alt="profile"/>
                          </span>
                        </div>
                      </div>
                      <div className="dropdownInfo">
                        <h4>
                          <span>
                            <b>Mahmudul </b>added to his favorite list<b> Leather belt steve madden</b>
                          </span>
                        </h4>
                        <p className="text-sky mb-0">few seconds ago</p>
                      </div>
                    </div>
                  </MenuItem>
                  </div>

                  <div className="pl-3 pr-3 pt-2 pb-1 w-100">
                    <Button className='btn-blue w-100' onClick={handleClosenotificationsDrop}>View all notifications</Button>
                  </div>

                </Menu>
              </div>

              {
                context.isLogin!==true ? <Link to={'/login'}> <Button className="btn-blue btn-lg btn-round">Sign In</Button> </Link>
                :
              <div className="myAccWrapper">
                <Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
                  <UserAvatarImgComponent img={'https://mironcoder-hotash.netlify.app/images/avatar/01.webp'}/>

                  <div className="userInfo">
                    <h4>Kenil Shah</h4>
                    <p className="mb-0">@Kenil</p>
                  </div>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={openMyAcc}
                  onClose={handleCloseMyAccDrop}
                  onClick={handleCloseMyAccDrop}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon> <PersonAdd fontSize="small" /> </ListItemIcon>
                    My Account
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon> <IoShieldHalfSharp/> </ListItemIcon>
                    Reset Password
                  </MenuItem>
                  <MenuItem onClick={handleCloseMyAccDrop}>
                    <ListItemIcon> <Logout fontSize="small" /> </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>

              </div>
              }
              

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;