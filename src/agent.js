import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import Irislogo from "./assets/Irislogo.svg";
import vector from "./assets/Vector.svg";
import Group from "./assets/Group.svg";

const Agent = ({ userData, onLogout }) => {
  // Function to create checkbox options for each test case
  const createCheckboxOptions = (testCaseName) => {
    const options = [
      "Success on first time",
      "Success on retry",
      "Partial Success",
      "Failed",
      "Not Applicable",
    ];
    return options.map((option, index) => (
      <div key={index}>
        <input
          type="checkbox"
          name={`${testCaseName}-option-${index + 1}`}
          value={option}
          id={`${testCaseName}-option-${index + 1}`}
        />
        <label htmlFor={`${testCaseName}-option-${index + 1}`}>{option}</label>
      </div>
    ));
  };

  return (
    <div>
      <header className="App-header">
        <img src={Group} alt="Logo 2" />
        <img src={Irislogo} alt="Logo 1" />
        <button type="submit" className="logout" onClick={onLogout}>
          <AiOutlineLogout style={{ verticalAlign: "middle" }} />{" "}
          <span style={{ verticalAlign: "middle" }}>Logout</span>{" "}
        </button>
      </header>
      <div className="centered-div">
        <div className="content-wrapper">
          <p>Site Agent: {userData?.userDetails?.username}</p>
          <p>Site: {userData?.stationDetails?.location_name}</p>
          <p>CPID: {userData?.userDetails?.charge_point_id}</p>
        </div>
        <button
          type="submit"
          className="download-button"
          style={{ marginRight: "20px", marginTop: "-60px" }}
        >
          <img
            src={vector}
            style={{ verticalAlign: "middle", marginRight: "10px" }}
            alt="Logo 2"
          />
          <span style={{ verticalAlign: "middle" }}>Download Script</span>{" "}
        </button>
      </div>
      <div className="form-div">
        <p style={{ marginLeft: "20px" }}>Testcases</p>
        <div className="form">
          {/* Generate checkboxes for each test case */}
          {userData?.chargerDetails?.test_cases.map((testCase, index) => (
            <div key={index}>
              <h3>
                {index + 1}. {testCase.name}
              </h3>
              {createCheckboxOptions(testCase.name)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Agent;
