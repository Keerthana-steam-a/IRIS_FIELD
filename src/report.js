import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { AiOutlineInfoCircle } from "react-icons/ai";
import Irislogo from "./assets/Irislogo.svg";
import vector from "./assets/Vector.svg";
import Group from "./assets/Group.svg";
import * as XLSX from "xlsx";

const Report = ({ userData, onLogout }) => {
  console.log("usedata", userData);
  let data;
  // if (userData?.userDetails?.user_type === "lead") {
  //   data = userData.chargerDetails[0]?.test_cases;
  // } else if (userData?.userDetails?.user_type === "assurance") {
    data = [];
    userData?.chargerDetails?.forEach((chargerDetail) => {
      if (chargerDetail.test_cases) {
        data.push(...chargerDetail.test_cases);
      }
    });
  // }

  const downloadExcel = () => {
    const data = userData?.chargerDetails.reduce(
      (accumulator, chargerDetail) => {
        chargerDetail.test_cases.forEach((testCase, index) => {
          const rowData = {
            id: chargerDetail.id,
            station_id: chargerDetail.station_id,
            cp_id: chargerDetail.cp_id,
            location_name: chargerDetail.location_name,
            oem_name: chargerDetail.oem_name,
            test_case_id: index + 1,
            test_case_name: testCase.name,
            test_case_result: testCase.successRatio,
          };
          accumulator.push(rowData);
        });
        return accumulator;
      },
      []
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
 const [tooltipContent, setTooltipContent] = useState("");
 const [showTooltip, setShowTooltip] = useState(false);
 const [currentSite, setCurrentSite] = useState("");
 const [currentSuccessRatio, setCurrentSuccessRatio] = useState("");

 const handleTooltipHover = (site, successRatio, reason) => {
   setCurrentSite(site);
   setCurrentSuccessRatio(successRatio);
   setTooltipContent(reason);
   setShowTooltip(true);
 };

 const handleTooltipLeave = () => {
   setShowTooltip(false);
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

      <div>
        <div className="lead-details">
          {userData?.chargerDetails?.length === 1 ? (
            <div>
              <p>Site Lead: {userData?.userDetails?.username}</p>
              <p>Site: {userData?.stationDetails?.location_name}</p>
            </div>
          ) : (
            <div>
              <p>Assurance Lead: {userData?.userDetails?.username}</p>
            </div>
          )}
          <button
            type="submit"
            className="download-button"
            onClick={downloadExcel}
          >
            <img
              src={vector}
              style={{ verticalAlign: "middle", marginRight: "10px" }}
              alt="Logo 2"
            />
            <span style={{ verticalAlign: "middle" }}>Download</span>{" "}
          </button>
        </div>
        <div
          className="report-div"
          style={{
            overflowX: "auto",
            overflowY: "auto",
            position: "relative",
            top: 0,
            right: 0,
          }}
        >
          <div style={{ overflowX: "auto", overflowY: "auto" }}>
            <table
            className="report"
            >
              <thead>
                <tr
                  style={{
                    background: "#F2F2F2",
                    height: "67px",
                    position: "sticky",
                    top: "0",
                    zIndex: "2",
                  }}
                >
                  <th
                    style={{
                      padding: "10px",
                      position: "sticky",
                      left: "0",
                      zIndex: "2",
                    }}
                  >
                    Sites
                  </th>
                  {userData?.chargerDetails[0]?.test_cases.map(
                    (testCase, index) => (
                      <th
                        key={index}
                        style={{
                          padding: "10px",
                          position: "sticky",
                          top: "0",
                          zIndex: "1",
                        }}
                      >
                        {testCase.name}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {userData?.chargerDetails.map((chargerDetail, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F2F2F2",
                      height: "67px",
                    }}
                  >
                    <td
                      className="sticky-cell"
                      
                    >
                      {chargerDetail.location_name
                        ? chargerDetail?.location_name
                        : userData?.stationDetails?.location_name}
                    </td>
                    {chargerDetail.test_cases.map((testCase, idx) => (
                      <td
                        key={idx}
                        style={{
                          color: "white",
                          padding: "10px",
                          backgroundColor:
                            testCase.successRatio === "a"
                              ? "#62BDFF"
                              : testCase.successRatio === "b"
                              ? "#46D766"
                              : testCase.successRatio === "c"
                              ? "#FFB800"
                              : testCase.successRatio === "d"
                              ? "#FF4E4E"
                              : testCase.successRatio === "e"
                              ? "#A9A9A9"
                              : "#46D766",
                        }}
                      >
                        <div className="success-ratio-container">
                          {testCase?.successRatio === "a"
                            ? "Success on first time"
                            : testCase?.successRatio === "b"
                            ? "Success on retry"
                            : testCase?.successRatio === "c"
                            ? "Partial Success"
                            : testCase?.successRatio === "d"
                            ? "Failed"
                            : testCase?.successRatio === "e"
                            ? "Not Applicable"
                            : "--"}
                          {/* Tooltip icon */}
                          <div
                            className="tooltip-icon"
                            onMouseEnter={() =>
                              handleTooltipHover(
                                chargerDetail.location_name,
                                testCase.name,
                                testCase.reason
                              )
                            }
                            onMouseLeave={handleTooltipLeave}
                          >
                            <AiOutlineInfoCircle />
                            {/* Tooltip content */}
                            {showTooltip &&
                              currentSite === chargerDetail.location_name &&
                              currentSuccessRatio === testCase.name && (
                                <div className="tooltip">{tooltipContent}</div>
                              )}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
