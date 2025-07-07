import { useEffect, useRef, useState, useContext } from "react";
import { Button } from "@mui/material";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { fetchDataFromApi } from "../../../utils/api";
import { SearchContext } from "../../../context/SearchContext";

const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef();
  const timeoutRef = useRef();
  const navigate = useNavigate();
  const { setSearchTerm } = useContext(SearchContext);

  const fetchResults = async (term) => {
    if (!term.trim()) return setResults([]);
    try {
      const res = await fetchDataFromApi(`/api/search?q=${term}`);
      setResults(Array.isArray(res) ? res : []);
    } catch {
      setResults([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => fetchResults(value), 600);
  };

  const handleSearch = () => {
    if (query.trim()) {
      setSearchTerm(query.trim());
      navigate("/search");
      setShowResults(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleOutsideClick = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="headersearchWrapper" ref={inputRef} style={{ position: "relative" }}>
      <div className="d-flex align-items-center">
        <div className="headerSearch ml-3 mr-3">
          <input
            type="text"
            placeholder="Search for Products.."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowResults(true)}
            onKeyDown={handleKeyDown} // 👈 added this
          />
          <Button onClick={handleSearch}>
            <IoIosSearch />
          </Button>
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="searchDropdown ml-3 mr-3">
          {results.map((item) => (
            <div className="resultRow" key={item._id}>
              <Link to={`/product/${item._id}`} onClick={() => setShowResults(false)}>
                <img src={item.images[0]} alt={item.name} />
              </Link>
              <div className="ml-1">
                <Link to={`/product/${item._id}`} onClick={() => setShowResults(false)}>
                  <h4 className="mb-1">{item.name.slice(0, 50)}...</h4>
                </Link>
                <span>Rs. {item.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
