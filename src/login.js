import React, { useState } from "react";
import Irislogo from "./assets/Irislogo.svg";
import Group from "./assets/Group.svg";
import welcome from "./assets/welcome.svg";
import frame from "./assets/Frame.svg";
import { toast } from "react-toastify";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (username.trim() !== "") {
      try {
        const response = await fetch("http://localhost:8080/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          onLogin(data);
        } else {
          const errorMessage = await response.text();
          toast.error(`Failed to login: ${errorMessage}`);
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    } else {
      console.log("Username cannot be empty");
    }
  };
  return (
    <div>
      <header className="App-header">
        <img src={Irislogo} alt="Logo 1" />
        <img src={Group} alt="Logo 2" />
      </header>
      <div className="login-box">
        <img src={welcome} alt="Welcome" className="welcome" />
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <input
              placeholder="username"
              type="text"
              id="username"
              name="username"
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="login">
            Login
          </button>
        </form>
      </div>
      <img src={frame} alt="frame" className="frame-image" />
    </div>
  );
}

export default Login;
