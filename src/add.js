import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IoMdArrowBack } from "react-icons/io";
import Irislogo from "./assets/Irislogo.svg";
import Group from "./assets/Group.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = ({ userData }) => {
  const [data, setData] = useState(null);
  const [newTestCase, setNewTestCase] = useState("");
const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (userData?.userDetails?.user_type === "agent") {
      navigate("/agent"); // Redirect to agent page
    } else {
      navigate("/report"); // Redirect to report page
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:8080/");
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      setData(jsonData);
    };

    fetchData();
  }, []);
  const handleEdit = async (index, newName) => {
    try {
      const response = await fetch(
        `http://localhost:8080/test_cases/${index}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update test case");
      }
      const newData = { ...data };
      newData.test_case[index].name = newName;
      setData(newData);
    } catch (error) {
      console.error("Error updating test case:", error);
    }
  };

  const handleDelete = async (nameToDelete) => {
    try {
      const response = await fetch(
        `http://localhost:8080/test_cases/${nameToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete test case");
      }else{
              toast.success("Test case deleted successfully");
      }
      const newData = { ...data };
      const updatedTestCases = newData.test_case.filter(
        (testCase) => testCase.name !== nameToDelete
      );
      newData.test_case = updatedTestCases;
      setData(newData);
    } catch (error) {
      toast.error("Error deleting test case");
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch("http://localhost:8080/test_cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTestCase }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new test case");
      } else {
        toast.success("Test case added successfully");
      }
      const newData = { ...data };
      newData.test_case.push({ name: newTestCase });
      setData(newData);
      setNewTestCase("");
    } catch (error) {
      console.error("Error adding new test case:", error);
    }
  };
  const handleSave = () => {
    console.log("saved")
    toast.success("Saved successfully");
  };
  console.log("data", data);
  return (
    <div>
            <ToastContainer />

      <header className="App-header">
        <img src={Group} alt="Logo 2" />
        <img src={Irislogo} alt="Logo 1" />
        <button
          type="button"
          className="logout"
          onClick={handleBackButtonClick}
        >
          <IoMdArrowBack style={{ verticalAlign: "middle" }} />{" "}
          <span style={{ verticalAlign: "middle" }}>Back</span>{" "}
        </button>
      </header>
      <div className="button-container">
        {/* Add test case input field and button */}
        <input
          className="test-case-input"
          type="text"
          value={newTestCase}
          onChange={(e) => setNewTestCase(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          style={{ marginLeft: "10px" }}
        >
          Add Test Case
        </button>
      </div>
      <div className="test-cases-container">
        <div className="test-cases">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.test_case.map((testCase, index) => (
                <tr key={index}>
                  <td>
                    <input
                      className="test-case-input"
                      type="text"
                      value={testCase.name}
                      onChange={(e) => handleEdit(index, e.target.value)}
                    />
                  </td>
                  <td>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                    <button
                      style={{ marginLeft: "10px" }}
                      onClick={() => handleDelete(testCase.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Add;
