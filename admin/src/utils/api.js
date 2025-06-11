import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BASE_URL = process.env.NODE_ENV === "development"
  ? process.env.REACT_APP_BACKEND_URL
  : "https://full-stack-ecommerce-project-u0om.onrender.com";// https://full-stack-ecommerce-project-u0om.onrender.com, full-stackecommerce-project-production.up.railway.app, https://savory-jumpy-gym.glitch.me

const logout = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userInfo");
  window.location.href = "/login";
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      enqueueSnackbar("Session expired. Please login again.", { variant: "error" });
      logout();
    }
    return Promise.reject(err);
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
    console.error("POST error:", error);
    const msg = error?.response?.data?.msg || "Something went wrong";
    enqueueSnackbar(msg, { variant: "error" });
    return {
      success: false,
      message: msg,
    };
  }
};

export const putData = async (url, formData, token) => {
  try {
    const { data } = await axiosInstance.put(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("PUT error:", error);
    const msg = error?.response?.data?.msg || "Something went wrong";
    enqueueSnackbar(msg, { variant: "error" });
    return null;
  }
};

export const deleteData = async (url, token) => {
  try {
    const { data } = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("DELETE error:", error);
    const msg = error?.response?.data?.msg || "Something went wrong";
    enqueueSnackbar(msg, { variant: "error" });
    return null;
  }
};
