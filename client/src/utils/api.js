import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BASE_URL = process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://full-stack-ecommerce-project-u0om.onrender.com"); // https://full-stack-ecommerce-project-u0om.onrender.com, full-stackecommerce-project-production.up.railway.app, https://savory-jumpy-gym.glitch.me

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    const msg = err?.response?.data?.msg || err?.response?.data?.message || "Something went wrong";
    enqueueSnackbar(msg, { variant: "error" });

    if (err?.response?.status === 401) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const postData = async (url, formData, token) => {
  try {
    const { data } = await axiosInstance.post(url, formData, token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    } : {});
    return data;
  } catch {
    return { success: false };
  }
};

export const putData = async (url, formData, token) => {
  try {
    const { data } = await axiosInstance.put(url, formData, token ? {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    } : {});
    return data;
  } catch {
    return { success: false };
  }
};