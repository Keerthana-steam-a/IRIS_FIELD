import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import BrowserRouter and Routes
import "./App.css";
import Login from "./login";
import Report from "./report";
import Agent from "./agent";
import Add from "./add";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUserData(data); // Store user data
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
const handleBackButtonClick = () => {
  setUserData(null);
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
              <>
                {userData?.userDetails?.user_type === "agent" ? (
                  <Agent userData={userData} onLogout={handleLogout} />
                ) : (
                  <Report userData={userData} onLogout={handleLogout} />
                )}
              </>
            )
          }
        />
        <Route
          path="/add"
          element={<Add handleBackButtonClick={handleBackButtonClick} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
