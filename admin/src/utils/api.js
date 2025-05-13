import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

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
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const putData = async (url, formData) => {
  try {
    const { data } = await axios.put(BASE_URL + url, formData);
    return data;
  } catch (error) {
    console.error("PUT error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const deleteData = async (url) => {
  try {
    const { data } = await axios.delete(BASE_URL + url);
    return data;
  } catch (error) {
    console.error("DELETE error:", error);
    return null;
  }
};
