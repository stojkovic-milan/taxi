import axios, {  } from "axios";
// import { lsGetToken } from "./localStorage";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}api`,
  headers: {
    "Content-type": "application/json",
  },
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = lsGetToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     //Differentiate 401 and 403
//     if (error.response.status == "401") {
//       window.location.href = "/";
//     } else if (error.response.status == "403") {
//       window.location.href = "/";
//     }
//     return Promise.reject(error);
//   }
// );
