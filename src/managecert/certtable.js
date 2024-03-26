import React, { useState } from "react";
import certTable from "./certdata.json";

const Certtable = ({ userData }) => {
  const [selectedComputer, setSelectedComputer] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter computer details based on selected computer name
  const filteredDetails = selectedComputer
    ? certTable.filter((item) => item["Computer Name"] === selectedComputer)
    : certTable;

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

  return (
    userData.role === "manager" || userData.role === "admin" ? (
      <div>
           <h1 style={{marginLeft:'500px',fontSize:'20px'}}>
          <b>CERTIFICATE DETAILS</b>
        </h1>
        <select value={selectedComputer} onChange={handleSelectComputer} style={{marginLeft:'120px',height:'25px',width:'150px'}}> 
          <option value="">Select Computer</option>
          {Array.from(new Set(certTable.map((item) => item["Computer Name"]))).map((computer, index) => (
            <option key={index} value={computer}>{computer}</option>
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
      </div>
    ) : (
      <div>You are not authorized to view this page.</div>
    )
  );
};

export default Certtable;
