import React from "react";
import { AiOutlineLogout } from "react-icons/ai";
import Irislogo from "./assets/Irislogo.svg";
import vector from "./assets/Vector.svg";
import Group from "./assets/Group.svg";
import * as XLSX from "xlsx";

const Report = ( {userData, onLogout }) => {
  console.log("usedata",userData)
  let data;

  if (userData?.chargerDetails?.length === 1) {
    data = userData.chargerDetails[0]?.test_cases;
  } else {
    data = [];
    userData?.chargerDetails?.forEach((chargerDetail) => {
      if (chargerDetail.test_cases) {
        data.push(...chargerDetail.test_cases);
      }
    });
  }

  const downloadExcel = () => {
    const data = userData?.chargerDetails.reduce(
      (accumulator, chargerDetail) => {
        chargerDetail.test_cases.forEach((testCase, index) => {
          const rowData = {
            id: chargerDetail.id,
            station_id: chargerDetail.station_id,
            cp_id: chargerDetail.cp_id,
            test_case_id: index + 1, // Assuming you want to include a test case ID
            location_name: chargerDetail.location_name,
            oem_name: chargerDetail.oem_name,
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
          {userData?.chargerDetails?.length === 1 ? (
            <table
              style={{
                borderCollapse: "collapse",
                margin: "20px",
                whiteSpace: "nowrap",
              }}
            >
              <tr style={{ background: "#F2F2F2", height: "67px" }}>
                {data.map((item, index) => (
                  <th key={index} style={{ padding: "10px" }}>
                    {item.name}
                  </th>
                ))}
              </tr>

              <tr style={{ background: "#FFFFFF", height: "67px" }}>
                {data.map((item, index) => (
                  <td
                    key={index}
                    style={{
                      color: "white",
                      padding: "10px",
                      backgroundColor:
                        item.successRatio === "Success on first time"
                          ? "#62BDFF"
                          : item.successRatio === "Success on retry"
                          ? "#46D766"
                          : item.successRatio === "Partial Success"
                          ? "#FFB800"
                          : item.successRatio === "Failed"
                          ? "#FF4E4E"
                          : item.successRatio === "Not Applicable"
                          ? "#A9A9A9"
                          : "#FFB800",
                    }}
                  >
                    {item.successRatio}
                  </td>
                ))}
              </tr>
            </table>
          ) : (
            <div style={{ overflowX: "auto", overflowY: "auto" }}>
              <table
                style={{
                  whiteSpace: "nowrap",
                  borderCollapse: "collapse",
                }}
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
                          <br />
                          {testCase.successRatio}{" "}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {userData?.chargerDetails.map(
                    (chargerDetail, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            index % 2 === 0 ? "#FFFFFF" : "#F2F2F2",
                          height: "67px",
                        }}
                      >
                        <td
                          style={{
                            padding: "10px",
                            position: "sticky",
                            left: "0",
                            zIndex: "1",
                            background: "#F2F2F2",
                          }}
                        >
                          {chargerDetail.location_name}
                        </td>
                        {chargerDetail.test_cases.map((testCase, idx) => (
                          <td
                            key={idx}
                            style={{
                              color: "white",
                              padding: "10px",
                              backgroundColor:
                                testCase.successRatio ===
                                "Success on first time"
                                  ? "#62BDFF"
                                  : testCase.successRatio === "Success on retry"
                                  ? "#46D766"
                                  : testCase.successRatio === "Partial Success"
                                  ? "#FFB800"
                                  : testCase.successRatio === "Failed"
                                  ? "#FF4E4E"
                                  : testCase.successRatio === "Not Applicable"
                                  ? "#A9A9A9"
                                  : "#46D766",
                            }}
                          >
                            {testCase?.successRatio
                              ? testCase?.successRatio
                              : "--"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
