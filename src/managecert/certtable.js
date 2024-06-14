import React, { useState, useEffect } from "react";
import certTable from "./certdata.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
const Certtable = ({ userData }) => {
  const [selectedComputer, setSelectedComputer] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expirationFilter, setExpirationFilter] = useState("all");

  const uniqueComputerNames = ["All", ...Array.from(
    new Set(certTable.map((item) => item["Computer Name"]))
  )];

  useEffect(() => {
    if (selectedComputer === "") {
      setSelectedComputer("All");
    }
  }, [selectedComputer]);

  const filteredDetails = selectedComputer !== "All"
    ? certTable.filter((item) => item["Computer Name"] === selectedComputer)
    : certTable;

  const currentDate = new Date();
  const filteredExpiration = filteredDetails.filter((item) => {
    const expirationDate = new Date(item["Valid To"]);
    const daysUntilExpiration = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
    if (expirationFilter === "7days" && daysUntilExpiration <= 7 && daysUntilExpiration > 0) {
      return true;
    }
    if (expirationFilter === "30days" && daysUntilExpiration <= 30 && daysUntilExpiration > 0) {
      return true;
    }
    if (expirationFilter === "expired" && expirationDate < currentDate) {
      return true;
    }
    return expirationFilter === "all";
  });

  const parseDate = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [hours, minutes, ampm] = timePart.split(':');
    const adjustedHours = ampm === 'PM' ? parseInt(hours, 10) + 12 : hours;
    const formattedDate = `${datePart} ${adjustedHours}:${minutes}`;
    return new Date(formattedDate);
  };

  const sortedDetails = filteredExpiration.slice().sort((a, b) => {
    const dateA = parseDate(a["Valid To"]);
    const dateB = parseDate(b["Valid To"]);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const isExpired = (dateString) => {
    const expirationDate = parseDate(dateString);
    const currentDate = new Date();
    return expirationDate < currentDate;
  };

  const handleSelectComputer = (event) => {
    setSelectedComputer(event.target.value);
  };

  const handleExpirationFilter = (event) => {
    setExpirationFilter(event.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const downloadAsCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      Object.keys(sortedDetails[0]).join(",") + "\n" +
      sortedDetails.map(row => {
        return Object.values(row)
          .map(value => {
            // If the value contains a comma, surround it with double quotes to preserve the comma in CSV
            if (value.includes(',')) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",");
      })
      .join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "certificates.csv");
    document.body.appendChild(link);
    link.click();
  };

  const noCertificatesMessage = (
    <tr>
      <td colSpan={Object.keys(sortedDetails[0] || {}).length} style={{ textAlign: "center" }}>
        No certificates match the selected expiration filter.
      </td>
    </tr>
  );

  return (
    <div style={{ overflowX: "auto", height: "91%", width: "57%" }}>
      <h1 style={{ fontSize: "20px", marginLeft: "400px", marginBottom: '20px' }}>CERTIFICATE DETAILS</h1>
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
      <label style={{ marginRight: "20px", marginLeft: "20px" }}>
        <b>Expiration Filter:</b>
      </label>
      <select
        value={expirationFilter}
        onChange={handleExpirationFilter}
        style={{ height: "25px", width: "200px" }}
      >
        <option value="all">All</option>
        <option value="7days">Expires in 7 Days</option>
        <option value="30days">Expires in 30 Days</option>
        <option value="expired">Already Expired</option>
      </select>
      <br></br><br></br>
      <div
      onClick={downloadAsCSV}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        padding: '8px 16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '4px',
        textDecoration: 'none',
        textAlign: 'center'
      }}
      title="Download Cert Details"
    >
      <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
      Cert Report
    </div>
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
          {sortedDetails.length > 0 ? (
            sortedDetails.map((row, rowIndex) => (
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
            ))
          ) : (
            noCertificatesMessage
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Certtable;
