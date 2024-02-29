import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./login";
import Report from "./report";
import Agent from "./agent";
import Add from "./add";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedIsLoggedIn && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/report" replace />
            )
          }
        />
        <Route
          path="/report"
          element={
            isLoggedIn && userData?.userDetails?.user_type === "agent" ? (
              <Agent userData={userData} onLogout={handleLogout} />
            ) : (
              <Report userData={userData} onLogout={handleLogout} />
            )
          }
        />
        <Route
          path="/add"
          element={
            isLoggedIn ? (
              <Add userData={userData} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
