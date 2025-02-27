import React from "react";
import "../styles/LoginScreen.css";
export default function LoginScreen() {
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

      <form className="login-form-container">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
        <button type="submit" className="button" style={{ marginTop: "20px" }}>
          Login
        </button>
      </form>
    </div>
  );
}
