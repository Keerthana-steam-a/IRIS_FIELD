// App.js
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
import AddStation from "./addstation";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState(""); // State to hold the username

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedIsLoggedIn && storedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  useEffect(() => {
    let intervalId;
    if (isLoggedIn) {
      const fetchData = async () => {
        try {
          const response = await fetch("http://43.204.74.225:8080/user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username }), // Sending username from state
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      // Fetch data initially
     
  if (isLoggedIn && userData?.userDetails?.user_type !== "agent") {
    fetchData(); // Initial fetch
    intervalId = setInterval(fetchData, 10000); // Fetch every 10 seconds
  }
    }

    return () => clearInterval(intervalId); // Cleanup function to clear interval when component unmounts or user logs out
  }, [isLoggedIn, username]);

  const handleLogin = (data) => {
    setIsLoggedIn(true);
    setUsername(data?.userDetails?.username); // Set the username in state
    setUserData(data);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(""); // Clear username state
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
        <Route
          path="/addstation"
          element={
            isLoggedIn ? (
              <AddStation userData={userData} />
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
