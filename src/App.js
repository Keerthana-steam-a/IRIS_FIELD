import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import "./App.css";
import Login from "./login";
import Report from "./report";
import Agent from "./agent";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data); // Store user data
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // window.location.href = "/login";
  };

  return (
    <Router>
      <Routes>
        {/* Render Report or Agent component based on isLoggedIn and user type */}
        {isLoggedIn ? (
          <>
            {userData?.userDetails?.user_type === "agent" ? (
              <Route
                path="/"
                element={<Agent userData={userData} onLogout={handleLogout} />}
              />
            ) : (
              <Route
                path="/"
                element={<Report userData={userData} onLogout={handleLogout} />}
              />
            )}
          </>
        ) : (
          <Route path="/" element={<Login onLogin={handleLogin} />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
