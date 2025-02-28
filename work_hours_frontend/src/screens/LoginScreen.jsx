import React, { useState } from "react";
import { login } from "../functions/authFunctions";
import "../styles/LoginScreen.css";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      console.log("Login response:", response); // For debugging
      if (response.data && response.data.user) {
        onLogin(response.data.user);
      } else {
        setError("Invalid response format from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h2 className="sub-header">
        Please login to view your projects and log your hours.
      </h2>
      {error && <p className="error-message">{error}</p>}

      <form className="login-form-container" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button" style={{ marginTop: "20px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
