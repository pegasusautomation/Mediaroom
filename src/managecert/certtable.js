import React, { useState, useEffect } from "react";
import certTable from "./certdata.json";

const Certtable = ({ userData }) => {
  const [selectedComputer, setSelectedComputer] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const uniqueComputerNames = Array.from(new Set(certTable.map(item => item["Computer Name"])));


  // Filter computer details based on selected computer name
  const filteredDetails = selectedComputer
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
  // Set default selected computer when component mounts
  useEffect(() => {
    if (uniqueComputerNames.length > 0 && !selectedComputer) {
      setSelectedComputer(uniqueComputerNames[0]);
    }
  }, [uniqueComputerNames, selectedComputer]);// Include uniqueComputerNames in the dependency array

  return (
    <div>
      {userData.role === "manager" || userData.role === "admin" ? (
        <>
        <h1 style={{marginLeft:'400px',fontSize:'20px'}}>
          <b>CERTIFICATE DETAILS</b>
        </h1>
        <label><b>Select ComputerName</b></label>
        <select value={selectedComputer} onChange={handleSelectComputer} style={{marginLeft:'10px',height:'25px',width:'150px'}}>
            {uniqueComputerNames.map((computer, index) => (
              <option key={index} value={computer}>
                {computer}
              </option>
            ))}
          </select>
          <br></br><br></br>
          {sortedDetails.length > 0 ? (
            <table style={{height:'300px',overflowY:'inherit'}}>
              <thead style={{background:'#908fb0'}}>
                <tr>
                  {Object.keys(sortedDetails[0]).map((key, index) => (
                    <th key={index} onClick={key === "Expiration Date" ? toggleSortOrder : null}>
                      {key}
                      {key === "Expiration Date" && <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedDetails.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <td key={cellIndex}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No details found.</p>}
        </>
      ) : (
        <div>You are not authorized to view this page.</div>
      )}
    </div>
  );
};

export default Certtable;
