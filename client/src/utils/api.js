import axios from "axios";

const BASE_URL = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_URL
    : "https://full-stack-ecommerce-project-u0om.onrender.com";// https://full-stack-ecommerce-project-u0om.onrender.com, full-stack-best-production.up.railway.app, https://savory-jumpy-gym.glitch.me

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

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
    console.error("POST error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
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