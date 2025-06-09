import { BrowserRouter, Route, Routes, useLocation, matchRoutes, useParams } from 'react-router-dom';
import { createContext, useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import TopLoadingBar from './components/TopLoadingBar';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/login';
import SignUp from './pages/SignUp';
import NotFound from './pages/NotFound';
import HomeBannerSlide from './pages/HomeBannerSlide';
import HomeBannerSlideAdd from './pages/HomeBannerSlide/AddHomeBannerSlide';
import Category from './pages/Category';
import CategoryAdd from './pages/Category/CategoryAdd';
import CategoryEdit from './pages/Category/CategoryEdit';
import SubCategory from './pages/Category/SubCategoryList';
import SubCategoryAdd from './pages/Category/SubCatAdd';
import Products from './pages/Products';
import ProductDetails from './pages/Products/ProductDetails';
import ProductUpload from './pages/Products/ProductUpload';
import ProductEdit from './pages/Products/ProductEdit';
import ProductsRam from './pages/Products/ProductsRam';
import ProductsWeight from './pages/Products/ProductsWeight';
import ProductsSize from './pages/Products/ProductsSize';

const MyContext = createContext();

function AppWrapper() {
  const location = useLocation();

  const [isToggleSidebar, setIsToggleSidebar] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme ? savedTheme === 'light' : true;
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    const userData = localStorage.getItem("userInfo");
    if (token && userData) {
      setIsLogin(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(()=>{
  if(themeMode===true){
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('themeMode','light');
  } else{
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
    setThemeMode,
    user,
    setUser,
  };

  const routes = [
    { path: '/' },
    { path: '/dashboard' },
    { path: '/login' },
    { path: '/signup' },
    { path: '/homeBannerSlide/list'},
    { path: '/homeBannerSlide/add'},
    { path: '/category' },
    { path: '/category/add' },
    { path: '/category/edit/:id' },
    { path: '/subCategory' },
    { path: '/subCategory/add' },
    { path: '/products' },
    { path: '/product/details' },
    { path: '/product/upload' },
    { path: '/productRAMS/add' },
    { path: '/product/edit/:id' },
    { path: '/productWEIGHT/add' },
    { path: '/productSIZE/add' },
  ];

  const matchedRoutes = matchRoutes(routes, location);
  const skipLoaderRoutes = [
    '/login',
    '/signUp',
    '/homeBannerSlide/list',
    '/homeBannerSlide/add',
    '/category/add',
    '/product/upload',
    '/productRAMS/add',
    '/productWEIGHT/add',
    '/productSIZE/add',
  ];
  const dynamicSkipRoutes = ['/category/edit/', '/product/edit/'];

  const hideLayout = !matchedRoutes || ['/login', '/signUp'].includes(location.pathname);
  
  const isNotFoundPage = !matchedRoutes;
  const skipLoader =
    isNotFoundPage ||
    skipLoaderRoutes.includes(location.pathname) ||
    dynamicSkipRoutes.some((path) => location.pathname.startsWith(path));

  return (
    <MyContext.Provider value={values}>
      <TopLoadingBar skip={skipLoader} />
      {!hideLayout && <Header key={isLogin ? user?.email : "guest"} />}
      <div className="main d-flex">
        {!hideLayout && (
          <div className={`sidebarWrapper ${isToggleSidebar ? 'toggle' : ''}`}>
            <Sidebar />
          </div>
        )}

        <div className={`content ${hideLayout ? 'full' : ''} ${isToggleSidebar ? 'toggle' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/homeBannerSlide/list" element={<HomeBannerSlide />} />
              <Route path="/homeBannerSlide/add" element={<HomeBannerSlideAdd />} />
              <Route path="/category" element={<Category />} />
              <Route path="/category/add" element={<CategoryAdd />} />
              <Route path="/category/edit/:id" element={<CategoryEdit />} />
              <Route path="/subCategory" element={<SubCategory />} />
              <Route path="/subCategory/add" element={<SubCategoryAdd />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/details" element={<ProductDetails />} />
              <Route path="/product/upload" element={<ProductUpload />} />
              <Route path="/product/edit/:id" element={<ProductEdit />} />
              <Route path="/productRAMS/add" element={<ProductsRam />} />
              <Route path="/productWEIGHT/add" element={<ProductsWeight />} />
              <Route path="/productSIZE/add" element={<ProductsSize />} />
            </Route>

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
export { MyContext };