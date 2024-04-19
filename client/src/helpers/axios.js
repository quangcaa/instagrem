import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});
