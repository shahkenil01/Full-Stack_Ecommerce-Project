import { FaAngleDown } from 'react-icons/fa';
import Dialog from '@mui/material/Dialog';
import { Button } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';
import { MdClose } from 'react-icons/md';
import React, { useContext, useEffect, useState } from 'react';
import Slide from '@mui/material/Slide';
import { MyContext } from '../../App';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropdown = () => {
  const [isOpenModel, setisOpenModel] = useState(false);
  const [selectedCountry, setselectedCountry] = useState(null);
  const [countryList, setcountryList] = useState([]);

  const context = useContext(MyContext);

  const selectCountry = (country) => {
    setselectedCountry(country);
    setisOpenModel(false);
    context.setselectedCountry(country);
  };

  useEffect(() => {
    setcountryList(context.countryList);
  }, [isOpenModel, context.countryList]);

  const filterList = (e) => {
    const keyword = e.target.value.toLowerCase();

    if (keyword !== '') {
      const list = context.countryList.filter((item) =>
        item.country.toLowerCase().includes(keyword),
      );
      setcountryList(list);
    } else {
      setcountryList(context.countryList);
    }
  };

  return (
    <>
      <Button
        className="countryDrop"
        onClick={() => setisOpenModel(true)}
        style={{ border: '1px solid rgba(0,0,0,0.2)' }}
      >
        <div className="info d-flex flex-column">
          <span className="lable">Your Location</span>
          <span className="name">
            {context.selectedCountry !== ''
              ? context.selectedCountry.length > 5
                ? context.selectedCountry?.substr(0, 5) + '...'
                : context.selectedCountry
              : 'All'}
          </span>
        </div>
        <span className="ml-auto">
          <FaAngleDown />
        </span>
      </Button>

      <Dialog
        open={isOpenModel}
        onClose={() => setisOpenModel(false)}
        className="locationModel"
        TransitionComponent={Transition}
      >
        <h4 className="p mb-0">Choose your Delivery Location</h4>
        <p className="p1">
          Enter your address and we will specify the offer for your area.
        </p>
        <Button className="close_" onClick={() => setisOpenModel(false)}>
          <MdClose />
        </Button>

        <div className="headerSearch w-100">
          <input
            type="text"
            placeholder="Search your area.."
            onChange={filterList}
          />
          <Button>
            <IoIosSearch />
          </Button>
        </div>

        <ul className="countryList mt-3">
          {countryList?.length !== 0 &&
            countryList?.map((item, index) => {
              return (
                <li key={index}>
                  <Button
                    onClick={() => selectCountry(item.country)}
                    className={`${
                      selectedCountry === item.country ? 'active' : ''
                    }`}
                  >
                    {item.country}
                  </Button>
                </li>
              );
            })}
        </ul>
      </Dialog>
    </>
  );
};

export default CountryDropdown;
