import axios from "axios";

const api = axios.create({
  baseURL: "https://auction-platform-mern-stack.onrender.com/api/v1",
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers["authorization"] = token;
//   return config;
// });

export default api;
