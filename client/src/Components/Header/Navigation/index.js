import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { IoIosMenu } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import images from '../../../assets/images';
import { fetchDataFromApi } from '../../../utils/api';

const Navigation = () => {
    const [isopenSidebarVal, setisopenSidebarVal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getSubCats = (categoryId) =>
      subCategories.filter(sub => sub.category && sub.category._id === categoryId);

    const customOrder = [ "Fashion", "Electronics", "Bags", "Footwear", "Groceries", "Beauty", "Wellness", "Jewellery" ];

    useEffect(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          const cats = await fetchDataFromApi('/api/category/all');
          const subs = await fetchDataFromApi('/api/subCat/');

          if (Array.isArray(cats) && Array.isArray(subs)) {
            const sortedAll = [...cats].sort((a, b) =>
              (customOrder.indexOf(a.name.trim()) ?? 999) - (customOrder.indexOf(b.name.trim()) ?? 999)
            );

            setCategories(sortedAll);
            setSubCategories(subs);
          }
        } catch (error) {
          console.error("Error fetching navigation data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, []);
    if (isLoading) {
      return null;
    }

    return(
      <>
      <nav className='navigation'>
        <div className='container mt-2'>
          <div className='row'>
            <div className='col-sm-2 navPart1'>
              <div className='catWrapper'>
                <Button className='allCatTab align-items-center' onClick={()=>setisopenSidebarVal(!isopenSidebarVal)}>
                  <span className='icon1 mr-2'><IoIosMenu/></span>
                  <span className="text">ALL CATEGORIES</span>
                  <span className='icon2 ml-2'><FaAngleDown/></span>
                </Button>

                <div className={`sidebarNav ${isopenSidebarVal===true ? 'open' : ''}`}>
                  <ul>
                    {categories.map((cat) => {
                      const subs = getSubCats(cat._id);
                      return (
                        <li key={cat._id}>
                          <Link to={`/products/cat/${cat._id}`}>
                            <Button>
                              <img src={images[cat.name]} width="20" className="mr-2" alt={cat.name} />
                              {cat.name}
                            </Button>
                          </Link>

                          {subs.length > 0 && (
                            <div className="submenu">
                              {subs.map((sub) => (
                                <Link to={`/products/subcat/${sub._id}`} key={sub._id}>
                                  <Button className="custom">{sub.subCat}</Button>
                                </Link>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className='col-sm-10 navPart2 d-flex align-items-center '>
              <ul className='list list-inline ml-auto'>
                {categories
                  .filter(cat => cat.name.trim().toLowerCase() !== 'jewellery')
                  .map((cat) => {
                    const subs = getSubCats(cat._id);
                    return (
                      <li className='list-inline-item' key={cat._id}>
                        <Link to={`/products/cat/${cat._id}`}>
                          <Button>
                            <img src={images[cat.name]} width="20" className="mr-2" alt={cat.name} />
                            {cat.name.toLowerCase()}
                          </Button>
                        </Link>
                            
                        {subs.length > 0 && (
                          <div className="submenu shadow">
                            {subs.map(sub => (
                              <Link to={`/products/subcat/${sub._id}`} key={sub._id}>
                                <Button>{sub.subCat}</Button>
                              </Link>
                            ))}
                          </div>
                        )}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      </>
    )
}

export default Navigation