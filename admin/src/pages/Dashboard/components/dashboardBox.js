import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { IoIosTimer } from "react-icons/io";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import ClickAwayListener from '@mui/material/ClickAwayListener';

const DashboardBox = ({ title, value, icon, grow, color, noFooter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const options = ['Last Day', 'Last Week', 'Last Month', 'Last Year'];

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className="dashboardBox"
      style={{
        backgroundImage: `linear-gradient(to right, ${color?.[0]}, ${color?.[1]})`,
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        cursor: "pointer",
      }}
    >
      <span className="chart">
        {grow ? <TrendingUpIcon /> : <TrendingDownIcon />}
      </span>

      <div className="d-flex w-100">
        <div className="col1">
          <h4 className="text-white mb-0">{title}</h4>
          <span className="text-white">{value}</span>
        </div>
        {icon && <div className="ml-auto icon">{icon}</div>}
      </div>

      {!noFooter && (
        <div className="d-flex align-items-center w-100 bottomEle">
          <h6 className="text-white mb-0 mt-0">Last Month</h6>
          <div className="ml-auto" style={{ position: "relative" }}>
            <Button className="toggleIcon" onClick={handleClick}>
              <HiDotsVertical />
            </Button>
      
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement="bottom-end"
              disablePortal
              style={{ zIndex: 999 }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <div className="dropdownMenu">
                  {options.map((option, index) => (
                    <MenuItem key={index} onClick={handleClose}>
                      <IoIosTimer style={{ marginRight: '8px' }} />
                      {option}
                    </MenuItem>
                  ))}
                </div>
              </ClickAwayListener>
            </Popper>
          </div>
        </div>
      )}      
    </div>
  );
};

export default DashboardBox;