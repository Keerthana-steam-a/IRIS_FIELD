import React, { useState } from "react";
import "./App.css";
import Login from "./login";
import Report from "./report";

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
    <div className="App">
      {isLoggedIn ? (
        <Report userData={userData} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
