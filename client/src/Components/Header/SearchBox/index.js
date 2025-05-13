import { Button } from '@mui/material';
import { IoIosSearch } from 'react-icons/io';

const SearchBox = () => {
  return (
    <div className="headersearchWrapper">
      <div class="d-flex align-items-center">
        <div className="headerSearch ml-3 mr-3">
          <input type="text" placeholder="Search for Products.." />
          <Button>
            <IoIosSearch />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
