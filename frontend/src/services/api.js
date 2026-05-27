import axios from "axios";
import { env } from "../config/env";

/* ===================================================== */
/* AXIOS INSTANCE */
/* ===================================================== */

const api = axios.create({

  baseURL:
    env.API_BASE_URL,

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
