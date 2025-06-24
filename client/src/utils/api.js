import axios from "axios";

const BASE_URL = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_URL
    : "https://full-stack-ecommerce-project-u0om.onrender.com";// https://full-stack-ecommerce-project-u0om.onrender.com, full-stack-best-production.up.railway.app, https://savory-jumpy-gym.glitch.me

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

const logoutUser = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  window.location.href = "/signIn";
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⛔ Token expired or invalid. Logging out.");
      logoutUser();
    }
    return Promise.reject(error);
  }
);

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axiosInstance.get(url);
    return data;
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const postData = async (url, formData) => {
  try {
    const { data } = await axiosInstance.post(url, formData);
    return data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("POST error:", error);
    }
    return {
      success: false,
      message: error?.response?.data?.msg || "Something went wrong",
    };
  }
};

export const putData = async (url, formData) => {
  try {
    const { data } = await axiosInstance.put(url, formData);
    return data;
  } catch (error) {
    console.error("PUT error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const getCartFromEmail = async (email) => {
  const res = await fetch(`http://localhost:4000/api/cart?userEmail=${email}`);
  const data = await res.json();
  return data;
};