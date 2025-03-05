import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
const AUTH_TOKEN_KEY = "token";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getStoredToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = token;
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/users/sign_in", {
      user: { email, password },
    });

    const token = response.headers.authorization;
    if (!token) {
      throw new Error("No authentication token received");
    }

    setAuthToken(token);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.message);
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const logout = async () => {
  try {
    await api.delete("/users/sign_out");
  } catch (error) {
    console.error("Logout error:", error.message);
  } finally {
    setAuthToken(null);
  }
};

export default api;
