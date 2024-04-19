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
    const dateA = new Date(a["Expiration Date"]);
    const dateB = new Date(b["Expiration Date"]);
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        // overflow: "auto",
      }}
    >
      <h1 style={{ fontSize: "20px", marginRight: "1200px", marginBottom:'20px' }}>
        <b>CERTIFICATE DETAILS</b>
      </h1>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px", marginRight:'1800px' }}>
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
      </div>
      <div style={{ overflowX: "auto", marginBottom: "100px" }}>
        {sortedDetails.length > 0 ? (
          <table style={{ minWidth: "100%" }}>
            <colgroup>
              {Object.keys(sortedDetails[0]).map((key, index) => (
                <col key={index} style={{ width: "200px", marginRight:'10px'}} /> 
              ))}
            </colgroup>
            <thead style={{ background: "#908fb0" }}>
              <tr>
                {Object.keys(sortedDetails[0]).map((key, index) => (
                  <th
                    key={index}
                    onClick={key === "Expiration Date" ? toggleSortOrder : null}
                  >
                    {key}
                    {key === "Expiration Date" && (
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
                    color: isExpired(row["Expiration Date"]) ? "red" : "inherit",
                  }}
                >
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No details found.</p>
        )}
      </div>
    </div>
  );
};
export default Certtable;
