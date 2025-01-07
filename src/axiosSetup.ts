import axios from "axios";
const getToken = () => {
  console.log("gettoken: ", localStorage.getItem("token"));
  return localStorage.getItem("token");
};
// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken() || ""}`, // Initial token
  },
});

// Axios request interceptor to update token
axiosInstance.interceptors.request.use(
  (config) => {
    // Update Authorization header with the latest token from localStorage

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    config.headers.Authorization = `Bearer ${getToken() || ""}`;
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  },
);

// Axios response interceptor to handle token refresh if needed
axiosInstance.interceptors.response.use(
  (response) => {
    // Do something with successful responses
    return response;
  },
  (error) => {
    // Handle response errors
    return Promise.reject(error);
  },
);
export default axiosInstance;
//baseURL: "https://api.h5shop.shop",
