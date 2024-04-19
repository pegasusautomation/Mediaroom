import React, { useState, useEffect } from "react";
import certTable from "./certdata.json";

const Certtable = ({ userData }) => {
  const [selectedComputer, setSelectedComputer] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const uniqueComputerNames = ["All", ...Array.from(
    new Set(certTable.map((item) => item["Computer Name"]))
  )];

  // Set the default selected computer name to "All" on component mount
  useEffect(() => {
    if (selectedComputer === "") {
      setSelectedComputer("All");
    }
  }, [selectedComputer]);

  // Filter computer details based on selected computer name
  const filteredDetails = selectedComputer !== "All"
    ? certTable.filter((item) => item["Computer Name"] === selectedComputer)
    : certTable;

  // Sort filtered details based on expiration date
  const sortedDetails = filteredDetails.slice().sort((a, b) => {
    const dateA = new Date(a["Valid To"]);
    const dateB = new Date(b["Valid To"]);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Handle dropdown change event
  const handleSelectComputer = (event) => {
    setSelectedComputer(event.target.value);
  };

  // Handle sorting toggle
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Check if a date is expired
  const isExpired = (dateString) => {
    const expirationDate = new Date(dateString);
    const currentDate = new Date();
    return expirationDate < currentDate;
  };


  return (
    <div style={{ overflowX: "auto", height: "91%", width: "57%" }}>
      <h1 style={{ fontSize: "20px", marginLeft: "400px", marginBottom:'20px' }}>CERTIFICATE DETAILS</h1>
<label style={{ marginRight: "20px" }}>
          <b>Select ComputerName</b>
        </label>
        <select
          value={selectedComputer}
          onChange={handleSelectComputer}
          style={{ height: "25px", width: "200px" }}
        >
          {uniqueComputerNames.map((computer, index) => (
            <option key={index} value={computer}>
              {computer}
            </option>
          ))}
        </select>
        <br></br><br></br>
        <table style={{ borderCollapse: "collapse", minHeight: "100%", minWidth: "100%", whiteSpace: "wrap" }}>
        <thead style={{ background: "#908fb0", color: "white" }}>
          <tr>
            {Object.keys(sortedDetails[0] || {}).map((key, index) => (
              <th
                key={index}
                onClick={key === "Valid To" ? toggleSortOrder : null}
                style={{ padding: "2px 2px", border: "1px solid #ddd", cursor: "pointer", fontSize: "12px" }}
              >
                {key}
                {key === "Valid To" && (
                  <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDetails.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              style={{
                color: isExpired(row["Valid To"]) ? "red" : "inherit",
              }}
            >
              {Object.entries(row).map(([key, value], cellIndex) => (
                <td key={cellIndex} style={{ padding: "2px 2px", border: "1px solid #ddd", wordWrap: "break-word", fontSize: "10px", whiteSpace: key === "Template Information" || key === "Issued To" || key === "Subject Key Identifier" ? "pre-wrap" : "nowrap" }}>
                  {key === "Issued By" || key === "Issued To" || key === "Template Information" ? (
                    <>
                      {value.split(',').map((line, index) => (
                        <div key={index}>{line.trim()}</div>
                      ))}
                    </>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};
export default Certtable;