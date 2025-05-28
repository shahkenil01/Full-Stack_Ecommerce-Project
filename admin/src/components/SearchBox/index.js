import { IoSearch } from "react-icons/io5";

const SearchBox = ({ value, onChange }) => {
  return(
    <div className="searchBox postion-relative d-flex align-items-center">
      <IoSearch className="mr-2"/>
      <input type="text" placeholder="Search here..."  value={value} onChange={(e) => onChange(e.target.value)}/>
    </div>
  )
}

export default SearchBox;