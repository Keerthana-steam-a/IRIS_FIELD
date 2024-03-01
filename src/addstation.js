import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Irislogo from "./assets/Irislogo.svg";
import Group from "./assets/Group.svg";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "react-modal";

Modal.setAppElement("#root");
const AddStation = ({ userData }) => {
  const [data, setData] = useState(null);
  const [newStationName, setNewStationName] = useState("");
  const [newOEM, setNewOEM] = useState("");
  const [newCPID, setNewCPID] = useState("");

  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    if (userData?.userDetails?.user_type === "agent") {
      navigate("/agent"); // Redirect to agent page
    } else {
      navigate("/report"); // Redirect to report page
    }
  };
  console.log("data", data);
  useEffect(() => {
    const fetchData = () => {
      const updatedData = userData.chargerDetails.map((chargerDetail) => ({
        ...chargerDetail,
        chargers: chargerDetail.chargers.map((charger) => ({
          ...charger,
          name: chargerDetail.stationDetails.location_name,
        })),
      }));

      const names = updatedData.map((chargerDetail) => ({
        name: chargerDetail.chargers.map((charger) => charger.name),
      }));

      setData(names);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
      // Add station
      const stationResponse = await fetch("http://localhost:8080/stations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stationName: newStationName,
          oem: newOEM,
        }),
      });

      if (!stationResponse.ok) {
        throw new Error("Failed to add new station");
      }

      const { stationId } = await stationResponse.json();
      setData([...data, { name: newStationName }]);
      // Add charger
      const chargerResponse = await fetch("http://localhost:8080/chargers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stationId,
          cpId: newCPID,
          testCases: [],
        }),
      });

      if (!chargerResponse.ok) {
        throw new Error("Failed to add new charger");
      }

      const userResponse = await fetch("http://localhost:8080/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newCPID,
          userType: "agent",
          cpId: newCPID,
          stationId,
        }),
      });

      if (!userResponse.ok) {
        throw new Error("Failed to add new user");
      }
      toast.success("Station, charger, and user added successfully");
      setNewStationName("");
      setNewOEM("");
      setNewCPID("");
    } catch (error) {
      console.error("Error adding new station, charger, and user:", error);
      toast.error("Failed to add station, charger, and user");
    }
  };

  const handleDelete = async (nameToDelete) => {
    try {
      // Implement deleting test case logic here
    } catch (error) {
      console.error("Error deleting test case:", error);
    }
  };
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);

const AssignPopup = ({ isOpen, onRequestClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Assign Popup"
      className="custom-modal"
    >
      <h2>Assign Station</h2>
      <p>Are you sure you want to assign this station?</p>
      <button className="modal-button" onClick={onRequestClose}>
        Cancel
      </button>
      <button style={{marginLeft:"10px"}} className="modal-button">Assign</button>
    </Modal>
  );
};

  return (
    <div>
      <AssignPopup
        isOpen={isAssignPopupOpen}
        onRequestClose={() => setIsAssignPopupOpen(false)}
      />

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
      <div className="button-input-container">
        <div className="input">
          <label>Station Name:</label>
          <input
            className="test-case-input"
            type="text"
            value={newStationName}
            onChange={(e) => setNewStationName(e.target.value)}
          />
        </div>
        <div className="input">
          <label>OEM:</label>
          <input
            className="test-case-input"
            type="text"
            value={newOEM}
            onChange={(e) => setNewOEM(e.target.value)}
          />
        </div>
        <div className="input">
          <label>CP_ID:</label>
          <input
            className="test-case-input"
            type="text"
            value={newCPID}
            onChange={(e) => setNewCPID(e.target.value)}
          />
        </div>
        <button
          className="download-button"
          type="button"
          onClick={handleAdd}
          style={{ marginLeft: "10px" }}
        >
          Add Station
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
              {data &&
                data.map((testCase, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        className="test-case-input"
                        type="text"
                        value={testCase.name}
                        readOnly={true}
                      />
                    </td>
                    <td>
                      <button
                        style={{ marginLeft: "10px" }}
                        onClick={() => setIsAssignPopupOpen(true)}
                      >
                        Assign
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

export default AddStation;
