import React, { useState, useEffect } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import Irislogo from "./assets/Irislogo.svg";
import Group from "./assets/Group.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Agent = ({ userData, onLogout }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [header, setHeader] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://43.204.74.225:8080/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setHeader(jsonData);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (
      userData &&
      userData.chargerDetails &&
      userData.chargerDetails.test_cases
    ) {
      const initialSelectedOptions = {};
      const initialInputValues = {};

      userData.chargerDetails.test_cases.forEach((testCase) => {
        initialSelectedOptions[testCase.name] = testCase.successRatio;
        initialInputValues[testCase.name] = testCase.reason || "";
      });

      setSelectedOptions(initialSelectedOptions);
      setInputValues(initialInputValues);
    }
  }, [userData]);

  const handleOptionSelect = (testCaseName, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [testCaseName]: option,
    });

    if (option !== "Success on first time") {
      setInputValues({
        ...inputValues,
        [testCaseName]: "",
      });
    } else {
      setInputValues({
        ...inputValues,
        [testCaseName]: undefined,
      });
    }
  };

  const handleInputChange = (testCaseName, value) => {
    setInputValues({
      ...inputValues,
      [testCaseName]: value,
    });
  };

  const handleSave = () => {
    const dataToSend = {
      cp_id: userData?.chargerDetails?.cp_id,
      test_cases: header?.test_case.map((headerItem) => ({
        name: headerItem.name,
        successRatio: selectedOptions[headerItem.name],
        reason:
          selectedOptions[headerItem.name] !== "Success on first time"
            ? inputValues[headerItem.name]
            : "",
      })),
    };

    console.log("dataToSend", dataToSend);
    fetch("http://43.204.74.225:8080/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success("Testcase Saved Successfully");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const createOptionButtons = (testCaseName) => {
    const options = [
      {
        option: "a",
        meaning: "Success on first time",
        className: "Success-on-first-time",
      },
      {
        option: "b",
        meaning: "Success on retry",
        className: "Success-on-retry",
      },
      { option: "c", meaning: "Partial Success", className: "Partial-Success" },
      { option: "d", meaning: "Failed", className: "Failed" },
      { option: "e", meaning: "Not Applicable", className: "Not-Applicable" },
    ];
    return options.map((opt, index) => (
      <button
        key={index}
        className={`option-button ${
          selectedOptions[testCaseName] === opt.option ? opt.className : ""
        }`}
        onClick={() => handleOptionSelect(testCaseName, opt.option)}
      >
        {opt.meaning}
      </button>
    ));
  };

  return (
    <div>
      <ToastContainer />

      <header className="App-header">
        <img src={Group} alt="Logo 2" />
        <img src={Irislogo} alt="Logo 1" />
        <button type="submit" className="logout" onClick={onLogout}>
          <AiOutlineLogout style={{ verticalAlign: "middle" }} />{" "}
          <span style={{ verticalAlign: "middle" }}>Logout</span>{" "}
        </button>
      </header>
      <div>
        <div className="centered-div">
          <div className="content-wrapper">
            <p>Site Agent: {userData?.userDetails?.username}</p>
            <p>Site: {userData?.stationDetails?.location_name}</p>
            <p>CPID: {userData?.chargerDetails?.cp_id}</p>
          </div>
          <button
            className="download-button"
            style={{ marginRight: "20px", marginTop: "70px" }}
            onClick={() => handleSave()}
          >
            Save
          </button>
        </div>
        <div className="form-div">
          <p style={{ marginLeft: "20px" }}>Testcases</p>
          <div className="form">
            {header &&
              header.test_case.map((headerItem, index) => (
                <div key={index} className="test-case-container">
                  <h3>
                    {index + 1}. {headerItem.name}
                  </h3>
                  <div className="option-buttons">
                    {createOptionButtons(headerItem.name)}
                  </div>
                  {inputValues[headerItem.name] !== undefined && (
                    <div className="input-wrapper">
                      <input
                        className="reason-box"
                        type="text"
                        value={inputValues[headerItem.name]}
                        onChange={(e) =>
                          handleInputChange(headerItem.name, e.target.value)
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
      </div>
    </div>
  );
};

export default Agent;
