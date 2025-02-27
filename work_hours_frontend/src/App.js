import { useState, useEffect } from "react";
import "./styles/BaseStyles.css";
import LoginScreen from "./screens/LoginScreen";
import ProjectsScreen from "./screens/ProjectsScreen";

function App() {
  const [screen, setScreen] = useState("projects");
  const [userLoggedIn, setUserLoggedIn] = useState(true);

  return (
    <div className="scaffold gradient-background">
      <div className="header-container">
        <h1 className="main-header">Work Log</h1>
      </div>

      <div className="body-container">
        {!userLoggedIn ? <LoginScreen /> : <ProjectsScreen />}
      </div>
    </div>
  );
}

export default App;
