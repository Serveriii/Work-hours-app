import axios from "axios";

const API_URL = "http://localhost:3000";

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/sign_in`, {
      user: {
        email,
        password,
      },
    });

    console.log("Response headers:", response.headers); // Debug headers
    console.log("Authorization header:", response.headers.authorization); // Debug token

    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem("token", token);
      // Set default Authorization header for future requests
      axios.defaults.headers.common["Authorization"] = token;
      console.log("Token stored:", localStorage.getItem("token")); // Debug stored token
    } else {
      console.warn("No token received in response");
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${API_URL}/users/sign_out`, {
      headers: {
        Authorization: token,
      },
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
  }
};
