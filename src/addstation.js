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
        // Add the station_id from stationDetails to the charger object
        station_id: chargerDetail.stationDetails.id,
        name: chargerDetail.stationDetails.location_name,
      })),
    }));

    const names = updatedData.map((chargerDetail) => ({
      name: chargerDetail.chargers.map((charger) => charger.name),
      station_id: chargerDetail.chargers.map((charger) => charger.station_id), // Add the station_id to the names object
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
  const [leadNames, setLeadNames] = useState([]);
  console.log("leadNames", leadNames);
  const [isAssignPopupOpen, setIsAssignPopupOpen] = useState(false);
const [stationId,setStationId]=useState([]);

const fetchUserList = async (stationId) => {
  try {
    const response = await fetch("http://localhost:8080/userlist");
    if (!response.ok) {
      throw new Error("Failed to fetch user list");
    }
    const data = await response.json();
    setLeadNames(data.user);
    setIsAssignPopupOpen(true);
    setStationId(stationId);
      console.log("stationId", stationId);
  } catch (error) {
    console.error("Error:", error.message);
  }
};
const handleAssign = async () => {
  try {
    const selectedLead = document.querySelector(".lead-select").value;
    const selectedStationId = stationId
    if (!selectedLead || !selectedStationId) {
      throw new Error("Invalid selection");
    }
        const response = await fetch(`http://localhost:8080/stationassign`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: selectedLead,
        stationId:stationId
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to assign user to station");
    }
    toast.success("User assigned to station successfully");
    setIsAssignPopupOpen(false); 
  } catch (error) {
    toast.error("Failed to assign user to station");
  }
};

  const AssignPopup = ({ isOpen, onRequestClose }) => {
    return (
      <Modal
        isOpen={isAssignPopupOpen}
        onRequestClose={onRequestClose}
        contentLabel="Assign Popup"
        className="custom-modal"
      >
        <h2>Assign Station</h2>
        <p>Select Lead to assign</p>
        <div>
          <select className="lead-select">
            {leadNames.map((lead, index) => (
              <option key={index} value={lead.username}>
                {lead.username}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button className="modal-button" onClick={handleAssign}>
            Assign
          </button>
          <button
            style={{ marginLeft: "10px" }}
            className="modal-button"
            onClick={onRequestClose}
          >
            Cancel
          </button>
        </div>
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
                        onClick={() =>
                          fetchUserList(testCase.station_id[0])
                        }
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
