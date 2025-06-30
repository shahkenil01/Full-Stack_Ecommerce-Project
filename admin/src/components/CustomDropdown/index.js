import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { RiArrowDropDownFill } from "react-icons/ri";
import Grow from '@mui/material/Grow';

const CustomDropdown = ({ value, onChange, options = [], placeholder = "Select", isDisabled = false, isMulti = false }) => {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);
  const wrapperRef = useRef(null);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(event.target) &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setOpen(false);
    }
  };

  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setPosition({
        top: window.scrollY + rect.bottom,
        left: window.scrollX + rect.left,
        width: rect.width
      });
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, []);

  useEffect(() => {
    if (open) updatePosition();
  }, [open]);

  const isSelected = (val) =>
    isMulti ? Array.isArray(value) && value.includes(val) : value === val;

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
    <>
      <div className={`custom-dropdown-wrapper ${open ? 'open' : ''}`} ref={wrapperRef}>
        <div className={`dropdown-select ${isDisabled ? 'disabled' : ''}`} onClick={() => !isDisabled && setOpen(!open)} >
          <span>{displayLabel()}</span>
          {!isDisabled && ( <RiArrowDropDownFill className={`dropdown-icon ${open ? 'rotate' : ''}`} /> )}
        </div>
      </div>

      {open && position &&
        createPortal(
          <Grow in={open}>
            <div ref={menuRef} className="dropdown-menu"
              style={{ position: 'absolute', top: `${position.top}px`, left: `${position.left}px`, width: `${position.width}px`, zIndex: 9999 }}
            >
              {options.map(opt => (
                <div key={opt.value} className={`dropdown-item ${isSelected(opt.value) ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)} >
                  {opt.label}
                </div>
              ))}
            </div>
          </Grow>,
          document.body
        )}
    </>
  );
};

export default CustomDropdown;