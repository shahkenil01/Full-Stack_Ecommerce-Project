import React, { useState, useRef, useEffect } from 'react';
import { RiArrowDropDownFill } from "react-icons/ri";
import Grow from '@mui/material/Grow';

const CustomDropdown = ({ value, onChange, options = [], placeholder = "Select", isDisabled = false, isMulti = false }) => {
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

  const isSelected = (val) =>
    isMulti
      ? Array.isArray(value) && value.includes(val)
      : value === val;

  const handleSelect = (val) => {
    if (isDisabled) return;

    if (isMulti) {
      let updated = Array.isArray(value) ? [...value] : [];
      if (updated.includes(val)) {
        updated = updated.filter((v) => v !== val);
      } else {
        updated.push(val);
      }
      onChange(updated);
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const displayLabel = () => {
    if (isMulti) {
      if (!Array.isArray(value) || value.length === 0) return <em>{placeholder}</em>;
      return value
        .map((v) => options.find((o) => o.value === v)?.label || v)
        .join(', ');
    } else {
      const matched = options.find(o => o.value === value);
      return matched ? matched.label : <em>{placeholder}</em>;
    }
  };

  return (
    <div className={`custom-dropdown-wrapper ${open ? 'open' : ''}`} ref={dropdownRef}>
      <div className={`dropdown-select ${isDisabled ? 'disabled' : ''}`} onClick={() => !isDisabled && setOpen(!open)}>
        <span>{displayLabel()}</span>
        {!isDisabled && (
          <RiArrowDropDownFill className={`dropdown-icon ${open ? 'rotate' : ''}`} />
        )}
      </div>
      <Grow in={open}>
        <div className="dropdown-menu">
          {options.map(opt => (
            <div
              key={opt.value}
              className={`dropdown-item ${isSelected(opt.value) ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.value)}
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