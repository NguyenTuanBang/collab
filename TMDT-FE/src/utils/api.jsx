// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_LOCAL_PORT}/api`,
  // baseURL: `${import.meta.env.VITE_DEPLOY_PORT}/api`,
  withCredentials: true,
});

export default api;
