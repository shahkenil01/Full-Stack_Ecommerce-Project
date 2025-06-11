import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BASE_URL = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_BACKEND_URL
    : "https://full-stack-ecommerce-project-u0om.onrender.com";// https://full-stack-ecommerce-project-u0om.onrender.com, full-stackecommerce-project-production.up.railway.app, https://savory-jumpy-gym.glitch.me

export const fetchDataFromApi = async (url) => {
  try {
    const { data } = await axios.get(BASE_URL + url);
    return data;
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

export const postData = async (url, formData) => {
  try {
    const { data } = await axios.post(BASE_URL + url, formData);
    return data;
  } catch (error) {
    console.error("POST error:", error);
    if (error?.response?.status === 403 && error?.response?.data?.msg?.toLowerCase()?.includes("admin")) {
      enqueueSnackbar(error.response.data.msg, { variant: "error" });
    }
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const putData = async (url, formData, token) => {
  try {
    const { data } = await axios.put(BASE_URL + url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("PUT error:", error);
    const msg = error?.response?.data?.msg || "Something went wrong";
    const status = error?.response?.status;

    if (status === 403 && msg.toLowerCase().includes("admin")) {
      enqueueSnackbar(msg, { variant: "error" });

      return null;
    }

    enqueueSnackbar(msg, { variant: "error" });
    return null;
  }
};

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(BASE_URL + url);
    return data;
  } catch (error) {
    console.error("DELETE error:", error);
    if (error?.response?.status === 403 && error?.response?.data?.msg?.toLowerCase()?.includes("admin")) {
      enqueueSnackbar(error.response.data.msg, { variant: "error" });
    }
    return null;
  }
};
