import { useState, useEffect } from "react";
import "./styles/BaseStyles.css";
import LoginScreen from "./screens/LoginScreen";
import ProjectsScreen from "./screens/ProjectsScreen";

function App() {
  const [screen, setScreen] = useState("projects");
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  return (
    <div className="scaffold gradient-background">
      <div className="header-container">
        <h1 className="main-header">Work Log</h1>
        <h2
          className="sub-header hover-text"
          onClick={() => setScreen("projects")}
        >
          Projects
        </h2>
        <h2
          className="sub-header hover-text"
          onClick={() => setScreen("login")}
        >
          {" "}
          {userLoggedIn ? "Logout" : "Login"}
        </h2>
      </div>

      <div className="body-container">
        {screen === "login" && <LoginScreen />}
        {screen === "projects" && <ProjectsScreen />}
      </div>
    </div>
  );
}

export default App;
