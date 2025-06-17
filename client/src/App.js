import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Header from './Components/Header';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Footer from './Components/Footer';
import ProductModel from './Components/ProductModel';
import Listing from './Pages/Listing';
import ProductDetails from './Pages/ProductDetails';
import Cart from './Pages/Cart';
import ScrollToTop from './ScrollToTop';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import OtpVerify from './Pages/SignUp/OtpVerify';
import NotFound from './Pages/NotFound';

const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    getCountry('https://countriesnow.space/api/v0.1/countries/');
  }, []);

  const getCountry = async (url) => {
    await axios.get(url).then((res) => {
      setCountryList(res.data.data);
    });
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
      setIsLogin(true);
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const values = {
    countryList,
    setselectedCountry,
    selectedCountry,
    isOpenProductModal,
    setIsOpenProductModal,
    selectedProduct,
    setSelectedProduct,
    isHeaderFooterShow,
    setisHeaderFooterShow,
    isLogin,
    setIsLogin,
    user,
    setUser,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MyContext.Provider value={values}>
        {isHeaderFooterShow === true && <Header />}

        <Routes>
          <Route path="/" exact={true} element={<Home />} />
          <Route path="/products/cat/:id" exact={true} element={<Listing />} />
          <Route path="/products/subcat/:id" exact={true} element={<Listing />} />
          <Route exact={true} path="/product/:id" element={<ProductDetails />} />
          <Route exact={true} path="/cart" element={<Cart />} />
          <Route exact={true} path="/signIn" element={<SignIn />} />
          <Route exact={true} path="/signUp" element={<SignUp />} />
          <Route exact={true} path="/verifyOTP" element={<OtpVerify />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {isHeaderFooterShow === true && <Footer />}

        {isOpenProductModal && (
          <ProductModel
            isOpen={isOpenProductModal}
            closeProductModal={() => setIsOpenProductModal(false)}
          />
        )}
      </MyContext.Provider>
    </BrowserRouter>
  );
}

export default App;
export { MyContext };
