import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg = err?.response?.data?.error || err?.message || "Network request failed";
    return Promise.reject(new Error(msg));
  },
);
