import { BrowserRouter, Route, Routes, useLocation, matchRoutes, useParams } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import ProductUpload from './pages/productUpload';
import Category from './pages/Category';
import CategoryAdd from './pages/CategoryAdd';
import CategoryEdit from './pages/CategoryEdit';
import TopLoadingBar from './components/TopLoadingBar';
import ProductsRam from './pages/ProductsRam';
import ProductsWeight from './pages/ProductsWeight';
import ProductsSize from './pages/ProductsSize';
import ProductEdit from './pages/productEdit';

const MyContext = createContext();

function AppWrapper() {
  const location = useLocation();

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme ? savedTheme === 'light' : true;
  });

  useEffect(()=>{
  if(themeMode===true){
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('themeMode','light');
  }
  else{
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('themeMode','dark');
  }
  },[themeMode]);

  const values = {
    isToggleSidebar,
    setIsToggleSidebar,
    isLogin,
    setIsLogin,
    themeMode,
    setThemeMode
  };

  const routes = [ { path: "/" }, { path: "/dashboard" }, { path: "/login" }, { path: "/signup" }, { path: "/products" }, { path: "/product/details" },
    { path: "/product/upload" }, { path: "/productRAMS/add" }, { path: "/productWEIGHT/add" }, { path: "/productSIZE/add" }, { path: "/product/edit/:id" },
    { path: "/category" }, { path: "/category/add" },  { path: "/subCategory" }, { path: "/subCategory/add" }, { path: "/category/edit/:id" }
  ];

  const matchedRoutes = matchRoutes(routes, location);
  const skipLoaderRoutes = [
    '/login', '/signup', '/category/add', '/product/upload', '/productRAMS/add', '/productWEIGHT/add', '/productSIZE/add'
  ];
  const dynamicSkipRoutes = [ '/category/edit/', '/product/edit/', ];

  const hideLayout = !matchedRoutes || ['/login', '/signup'].includes(location.pathname);
  
  const isNotFoundPage = !matchedRoutes;
  const skipLoader =
    isNotFoundPage || skipLoaderRoutes.includes(location.pathname) ||
    dynamicSkipRoutes.some(path => location.pathname.startsWith(path));

  return (
    <MyContext.Provider value={values}>
    <TopLoadingBar skip={skipLoader} />
      { !hideLayout && <Header /> }
      <div className='main d-flex'>
        {
          !hideLayout && 
          <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}`}>
            <Sidebar />
          </div>
        }

        <div className={`content ${hideLayout ? 'full' : ''} ${isToggleSidebar ? 'toggle' : ''}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/details" element={<ProductDetails />} />
            <Route path="/product/upload" element={<ProductUpload />} />
            <Route path="/product/edit/:id" element={<ProductEdit />} />
            <Route path="/productRAMS/add" element={<ProductsRam />} />
            <Route path="/productWEIGHT/add" element={<ProductsWeight />} />
            <Route path="/productSIZE/add" element={<ProductsSize />} />
            <Route path="/category" element={<Category />} />
            <Route path="/category/add" element={<CategoryAdd />} />
            <Route path="/subCategory" element={<CategoryEdit />} />
            <Route path="/subCategory/add" element={<CategoryEdit />} />
            <Route path="/category/edit/:id" element={<CategoryEdit />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </MyContext.Provider>
  );
}


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
export {MyContext}