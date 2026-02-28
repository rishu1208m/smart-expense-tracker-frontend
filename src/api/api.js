import axios from "axios";

const API = axios.create({
  baseURL: "https://smart-expense-tracker-backend-production-a4a5.up.railway.app",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;