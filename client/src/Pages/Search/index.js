import Sidebar from '../../Components/Sidebar';
import Button from '@mui/material/Button';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { useParams, useLocation } from 'react-router-dom';
import ProductItem from '../../Components/ProductItem';
import { useEffect, useState, useContext } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { SearchContext } from '../../context/SearchContext';

const SearchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productView, setProductView] = useState('four');
  const [products, setProducts] = useState([]);

  const { id } = useParams();
  const location = useLocation();
  const path = location.pathname;
  const isSubCategory = path.includes('/subcat/');
  
  const [selectedSubs, setSelectedSubs] = useState([]);
  const [priceRange, setPriceRange] = useState([100, 70000]);
  const [statusFilter, setStatusFilter] = useState('');
  const { searchTerm } = useContext(SearchContext);

  useEffect(() => {
    setIsLoading(true);

    const applyFilters = (data) => {
      let filtered = data;

      if (selectedSubs.length > 0) {
        filtered = filtered.filter(
          (item) =>
            item.subcategory && selectedSubs.includes(item.subcategory._id)
        );
      }

      filtered = filtered.filter((item) => {
        const price = parseFloat(item.price || 0);
        return price >= priceRange[0] && price <= priceRange[1];
      });

      if (statusFilter) {
        filtered = filtered.filter(
          (item) => Math.floor(item.rating || 0) === parseInt(statusFilter)
        );
      }

      setProducts(filtered);
      setIsLoading(false);
    };

    const loadData = async () => {
      try {
        if (searchTerm) {
          const res = await fetchDataFromApi(`/api/search?q=${searchTerm}`);
          if (Array.isArray(res)) {
            applyFilters(res);
          } else {
            setProducts([]);
            setIsLoading(false);
          }
        } else {
          const res = await fetchDataFromApi('/api/products');
          if (Array.isArray(res)) {
            let filtered = res;

            if (isSubCategory) {
              filtered = res.filter(
                (item) => item.subcategory?._id === id
              );
            } else if (id) {
              filtered = res.filter((item) => item.category?._id === id);
            }

            applyFilters(filtered);
          } else {
            setProducts([]);
            setIsLoading(false);
          }
        }
      } catch (err) {
        setProducts([]);
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, selectedSubs, priceRange, statusFilter, searchTerm]);

  return (
    <section className="product_Listing_Page">
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar
            selectedSubs={selectedSubs}
            setSelectedSubs={setSelectedSubs}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <div className="content_right">
            <div className="showBy mb-3 d-flex align-items-center">
              <div className="d-flex align-items-center btnWrapper">
                <Button
                  className={productView === 'one' && 'act'}
                  onClick={() => setProductView('one')}
                >
                  <IoIosMenu />
                </Button>
                <Button
                  className={productView === 'three' && 'act'}
                  onClick={() => setProductView('three')}
                >
                  <CgMenuGridR />
                </Button>
                <Button
                  className={productView === 'four' && 'act'}
                  onClick={() => setProductView('four')}
                >
                  <TfiLayoutGrid4Alt />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center mt-5">
                <div
                  className="spinner-border mt-5"
                  role="status"
                  style={{ width: '3rem', height: '3rem', color: '#000' }}
                >
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="productListing">
                {products.length > 0 ? (
                  products.map((item) => (
                    <ProductItem
                      key={item._id}
                      item={item}
                      itemView={productView}
                    />
                  ))
                ) : (
                  <p className="text-center mt-5">No products found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
