import axios from "axios";

// Set VITE_API_URL in a .env file for production (your deployed backend URL).
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("trackfolio_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const login = (email, password) => {
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);
  return api.post("/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const getApplications = () => api.get("/applications");
export const createApplication = (data) => api.post("/applications", data);
export const updateApplication = (id, data) => api.put(`/applications/${id}`, data);
export const deleteApplication = (id) => api.delete(`/applications/${id}`);
export const getDashboard = () => api.get("/dashboard");

export default api;
