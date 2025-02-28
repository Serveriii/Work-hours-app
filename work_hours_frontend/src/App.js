import { useState, useEffect } from "react";
import "./styles/BaseStyles.css";
import LoginScreen from "./screens/LoginScreen";
import ProjectsScreen from "./screens/ProjectsScreen";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if we have a token and user data
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUserLoggedIn(true);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    console.log("Handling login with user data:", userData); // For debugging
    if (userData) {
      setCurrentUser(userData);
      setUserLoggedIn(true);
      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setUserLoggedIn(false);
  };

  return (
    <div className="scaffold gradient-background">
      <div className="header-container">
        <h1 className="main-header">Work Log</h1>
        {userLoggedIn && currentUser && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className="body-container">
        {!userLoggedIn ? (
          <LoginScreen onLogin={handleLogin} />
        ) : (
          <ProjectsScreen user={currentUser} />
        )}
      </div>
    </div>
  );
}

export default App;
