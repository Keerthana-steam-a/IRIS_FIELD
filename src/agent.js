import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import Irislogo from "./assets/Irislogo.svg";
import vector from "./assets/Vector.svg";
import Group from "./assets/Group.svg";

const Agent = ({ userData, onLogout }) => {
  // State to manage selected options and corresponding input values for each test case
  const [selectedOptions, setSelectedOptions] = useState({});
  const [inputValues, setInputValues] = useState({});

  // Function to handle option selection
  const handleOptionSelect = (testCaseName, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [testCaseName]: option,
    });

    // If the selected option is not "Success on first time", show the input box
    if (option !== "Success on first time") {
      setInputValues({
        ...inputValues,
        [testCaseName]: "",
      });
    } else {
      // If the selected option is "Success on first time", hide the input box
      setInputValues({
        ...inputValues,
        [testCaseName]: undefined,
      });
    }
  };

  // Function to handle input change
  const handleInputChange = (testCaseName, value) => {
    setInputValues({
      ...inputValues,
      [testCaseName]: value,
    });
  };

  // Function to handle saving data to API
  const handleSave = (testCaseName) => {
    // Map options to specific characters
    const optionToCharacter = {
      "Success on first time": "a",
      "Success on retry": "b",
      "Partial Success": "c",
      Failed: "d",
      "Not Applicable": "e",
    };

    const dataToSend = {
      cp_id: userData?.chargerDetails?.cp_id,
      test_cases: userData?.chargerDetails?.test_cases.map((testCase) => ({
        name: testCase.name,
        successRatio: optionToCharacter[selectedOptions[testCase.name]],
        reason:
          selectedOptions[testCase.name] !== "Success on first time"
            ? inputValues[testCase.name]
            : "",
      })),
    };

    // Send data to API using fetch or your preferred method
    fetch("http://43.204.74.225:8080/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success response from API
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error response from API
      });
  };

  // Function to create options as buttons
  const createOptionButtons = (testCaseName) => {
    const options = [
      "Success on first time",
      "Success on retry",
      "Partial Success",
      "Failed",
      "Not Applicable",
    ];
    return options.map((option, index) => (
      <button
        key={index}
        className={`option-button ${
          selectedOptions[testCaseName] === option
            ? option.replace(/\s+/g, "-")
            : ""
        }`}
        onClick={() => handleOptionSelect(testCaseName, option)}
      >
        {option}
      </button>
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
          <p>CPID: {userData?.chargerDetails?.cp_id}</p>
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
          {userData?.chargerDetails?.test_cases.map((testCase, index) => (
            <div key={index} className="test-case-container">
              <h3>
                {index + 1}. {testCase.name}
              </h3>
              <div className="option-buttons">
                {createOptionButtons(testCase.name)}
              </div>
              {inputValues[testCase.name] !== undefined && (
                <div className="input-wrapper">
                  <input
                    className="reason-box"
                    type="text"
                    value={inputValues[testCase.name]}
                    onChange={(e) =>
                      handleInputChange(testCase.name, e.target.value)
                    }
                    placeholder="Enter reason..."
                    style={{ marginBottom: "10px", paddingRight: "40px" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        className="save-button"
        onClick={() => handleSave()}
        style={{
          position: "absolute",
          right: "20px",
          bottom: "20px",
        }}
      >
        Save
      </button>
    </div>
  );
};

export default Agent;
