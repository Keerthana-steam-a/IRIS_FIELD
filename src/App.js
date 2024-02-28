import React, { useState } from "react";
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

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // setUserData(null);
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
       
        <Route path="/add" element={ isLoggedIn &&<Add userData={userData} />} />
      </Routes>
    </Router>
  );
}

export default App;
