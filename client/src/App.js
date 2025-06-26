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
import Favorite from './Pages/Favorite';
import CheckoutForm from './Pages/Checkout';
import OrderStatus from './Pages/Order/OrderStatus';
import AllOrders from './Pages/Order/AllOrders';
import MyAccount from './Pages/MyAccount';

const MyContext = createContext();

function App() {
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setselectedCountry] = useState('');
  const [isOpenProductModal, setIsOpenProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isHeaderFooterShow, setisHeaderFooterShow] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

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
    const storedCart = localStorage.getItem("cartItems");
    if (userInfo) {
      setUser(JSON.parse(userInfo));
      setIsLogin(true);
      
        if (storedCart) {
        try {
          const parsed = JSON.parse(storedCart);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        } catch (err) {
          console.error("Failed to parse stored cart:", err);
        }
      }
    }
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item =>
        item.productId === product._id || item._id === product._id
      );
      if (existingItem) {
        return prevItems.map(item =>
          (item.productId === product._id || item._id === product._id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };
  const updateCartQuantity = (productId, newQty) => {
    setCartItems(prev =>
      prev.map(item =>
        (item.productId === productId || item._id === productId)
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };
  
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setUser(parsedUser);
      setIsLogin(true);

      localStorage.removeItem("saveOrder");

      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/cart/user/${parsedUser.email}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCartItems(data);
          }
        })
        .catch(err => console.error("Failed to fetch user cart:", err));
    }
  }, []);

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
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
    setCartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
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
          <Route exact={true} path="/my-list" element={<Favorite />} />
          <Route exact={true} path="/checkout" element={<CheckoutForm />} />
          <Route exact={true} path="/my-account" element={<MyAccount />} />
          <Route exact={true} path="/order" element={<OrderStatus />} />
          <Route exact={true} path="/orders" element={<AllOrders />} />
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
