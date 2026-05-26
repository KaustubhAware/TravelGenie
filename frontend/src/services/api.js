import axios from "axios";

/* ===================================================== */
/* AXIOS INSTANCE */
/* ===================================================== */

const api = axios.create({

  baseURL:
    "http://127.0.0.1:8000/api",

  headers: {
    "Content-Type":
      "application/json",
  },

});

/* ===================================================== */
/* TOKEN */
/* ===================================================== */

api.interceptors.request.use(

  async (config) => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;

    }

    return config;

  },

  (error) => {

    return Promise.reject(
      error
    );

  }

);

export default api;