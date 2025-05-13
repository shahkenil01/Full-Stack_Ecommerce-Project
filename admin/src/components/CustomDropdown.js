import React, { useState, useRef, useEffect } from 'react';
import { RiArrowDropDownFill } from "react-icons/ri";
import Grow from '@mui/material/Grow';

const CustomDropdown = ({ value, onChange, options = [], placeholder = "Select" }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`custom-dropdown-wrapper ${open ? 'open' : ''}`} ref={dropdownRef}>
      <div className="dropdown-select" onClick={() => setOpen(!open)}>
        <span>{value ? options.find(o => o.value === value)?.label : <em>{placeholder}</em>}</span>
        <RiArrowDropDownFill className={`dropdown-icon ${open ? 'rotate' : ''}`} />
      </div>
      <Grow in={open}>
        <div className="dropdown-menu">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`dropdown-item ${value === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </Grow>
    </div>
  );
};

export default CustomDropdown;