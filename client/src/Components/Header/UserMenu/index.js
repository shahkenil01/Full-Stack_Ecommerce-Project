import React, { useContext, useState } from 'react';
import { Menu, MenuItem, ListItemIcon, Divider, Avatar, Typography, Box, Button} from '@mui/material';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { FiUser } from 'react-icons/fi';
import { MyContext } from '../../../App';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const context = useContext(MyContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796', '#fd7e14', '#20c997']; 

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem("cartItems");
    localStorage.removeItem('order_last');
    context.setUser(null);
    context.setIsLogin(false);
    context.setCartItems([]);
    navigate('/signIn');
  };

  const user = context.user || JSON.parse(localStorage.getItem('userInfo')) || {};
  const initials = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  
  const getColorFromName = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <>
      <Button className='circle mr-3' onClick={handleMenuClick}>
        <FiUser />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{ elevation: 3,
          sx: { mt: 1.5, overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '&::before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10,
              bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box px={2} py={1.5} display="flex" alignItems="center">
          <Avatar sx={{ width: 40, height: 40, mr: 1, bgcolor: getColorFromName(user.name) }}>{initials}</Avatar>
          <Box>
            <Typography fontWeight="bold">{user.name || 'User Name'}</Typography>
            <Typography variant="body2">{user.email || 'email@example.com'}</Typography>
          </Box>
        </Box>
        <Divider />
        <MenuItem onClick={() => navigate('/my-account')}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          My Account
        </MenuItem>
        <MenuItem onClick={() => navigate('/order')}>
          <ListItemIcon><ShoppingBagIcon fontSize="small" /></ListItemIcon>
          Orders
        </MenuItem>
        <MenuItem onClick={() => navigate('/my-list')}>
          <ListItemIcon><FavoriteBorderIcon fontSize="small" /></ListItemIcon>
          My List
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
