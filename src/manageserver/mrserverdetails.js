import React, { useState } from "react";
import jsonData from "./mrserverdata.json";
import "../grid.css";
 
const ITEMS_PER_PAGE = 2;
 
const Mrserverdetails = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("ComputerName");
 
  const handleStop = (roleName, computerName) => {
  // const { Name } = roleName; // Extract the service name from the role object
  const jsonServiceInfo = JSON.stringify({ roleName, computerName }); // Send Name and computerName as JSON data
  console.log(jsonServiceInfo)
    fetch('/stop-service', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error stopping service');
        }
        console.log('Service stopped successfully.');
      })
      .catch(error => {
        console.error('Error stopping service:', error.message);
      });
    alert("Service stopped");
    console.log("Stop action for computer:", roleName);
  };
 
  const handleStopAll = (computerName) => {
    // const { Name } = roleName; // Extract the service name from the role object
    const jsonServiceInfo = JSON.stringify({ computerName }); // Send Name and computerName as JSON data
    console.log(jsonServiceInfo)
      fetch('/stopall-services', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error stopping service');
          }
          console.log('All Services stopped successfully.');
        })
        .catch(error => {
          console.error('Error stopping service:', error.message);
        });
      alert("All Services stopped");
    };
   
    const handleStartAll = (computerName) => {
      // const { Name } = roleName; // Extract the service name from the role object
      const jsonServiceInfo = JSON.stringify({ computerName }); // Send Name and computerName as JSON data
      console.log(jsonServiceInfo)
        fetch('/startall-services', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error stopping service');
            }
            console.log('All Services started successfully.');
          })
          .catch(error => {
            console.error('Error stopping service:', error.message);
          });
        alert("All Services started");
      };
   
      const handleRestartAll = (computerName) => {
        // const { Name } = roleName; // Extract the service name from the role object
        const jsonServiceInfo = JSON.stringify({ computerName }); // Send Name and computerName as JSON data
        console.log(jsonServiceInfo)
          fetch('/restartall-services', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
            .then(response => {
              if (!response.ok) {
                throw new Error('Error stopping service');
              }
              console.log('All Services Restarted successfully.');
            })
            .catch(error => {
              console.error('Error stopping service:', error.message);
            });
          alert("All Services Restarted");
        };
       
  // Other functions like handleStart and handleRestart remain unchanged
  const handleStart = (roleName, computerName) => {
   
    const jsonServiceInfo = JSON.stringify({ roleName, computerName }); // Send Name and computerName as JSON data
    console.log(jsonServiceInfo)
   
    // Add logic to handle stop action
    fetch('/start-service', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error stopping service');
        }
        console.log('Service stopped successfully.');
        // Handle success as needed
      })
      .catch(error => {
        console.error('Error stopping service:', error.message);
        // Handle error as needed
      });
      alert("service started");
      console.log("start action for index:", roleName);
  };
 
  const handleRestart = (roleName, computerName) => {
   
    const jsonServiceInfo = JSON.stringify({ roleName, computerName }); // Send Name and computerName as JSON data
    console.log(jsonServiceInfo)
   
    // Add logic to handle stop action
    fetch('/restart-service', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error stopping service');
        }
        console.log('Service stopped successfully.');
        // Handle success as needed
      })
      .catch(error => {
        console.error('Error stopping service:', error.message);
        // Handle error as needed
      });
      alert("service restarted");
      console.log("Restart action for index:", roleName);
  };
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
  };
 
  const handleColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchTerm('');
    setCurrentPage(1);
  };
 
  const filteredData = jsonData.filter((item) => {
    const searchValue = item[searchColumn];
  
    if (searchValue && Array.isArray(searchValue)) {
      return searchValue.some(role => role.Status && role.Status.toLowerCase().includes(searchTerm.toLowerCase()));
    } else if (searchValue && typeof searchValue === 'string') {
      return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (typeof searchValue === 'number' && !isNaN(searchValue)) {
      return searchValue === parseFloat(searchTerm);
    } else {
      return searchValue === searchTerm;
    }
  });  
  
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, jsonData.length);
 
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
 
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
 
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '1108px', height: '520px', marginBottom: '10px', overflow: 'auto' }}>
      <caption style={{ fontSize: '30px', marginLeft: '-80px' }}>PLANO SERVERS</caption>
      <div style={{ alignItems: 'center' }}>
        {filteredData.length > 0 && (
          <select
            value={searchColumn}
            onChange={handleColumnChange}
            style={{ marginLeft: '220px', width: '120px' }}
          >
            <option value="ComputerName">ComputerName</option>
            <option value="ServiceStatus">ServiceStatus</option>
          </select>
        )}
        <input
          className="searchstyle"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ height: '20px', width: '200px', boxSizing: 'border-box', marginLeft: '350px' }}
        />
      </div>
      <br />
      {filteredData.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridGap: '15px', overflowY: 'inherit', overflowX: "hidden" }}>
          {filteredData.slice(startIndex, endIndex).map((item, index) => (
            <div key={index} className="grid-item">
              <div>
                <strong style={{ color: '#154775' }}>Computer Name:</strong> {item.ComputerName}
              </div>
              <br />
              <div>
                <strong style={{ color: '#154775' }}>Computer Status:</strong> {item.ComputerStatus}
              </div>
              <br />
              <div>
                <strong style={{ color: '#154775' }}>Service Status:</strong>
                <ul>
                  {item.ServiceStatus.map((role, roleIndex) => (
                    <li key={roleIndex}>
                      <strong>Name:</strong> {role.Name},<br />
                      <strong>Status:</strong> <span style={{ color: role.Status === "Stopped" ? "red" : "green", marginRight: '150px' }}>{role.Status}</span>
                     {role.Status !== "NA" && (
  <>
    {role.Status === "Stopped" ? (
      <button onClick={() => handleStart(role.Name, item.ComputerName)} style={{ marginRight: '10px', background: '#0cb061', padding: '2px' }}>Start</button>
    ) : (
      <>
        <button onClick={() => handleStop(role.Name, item.ComputerName)} style={{marginRight: '10px', background:'#b95d5d'}}>Stop</button>
        <button onClick={() => handleRestart(role.Name, item.ComputerName)} style={{background:'#635279'}}>Restart</button>
      </>
    )}
  </>
)}
 {/* <br></br>
 <br></br>
 <label style={{ marginRight:'5px' }}><b>Recycle All services</b></label>
 <button onClick={() => handleStopAll(item.ComputerName)} style={{marginLeft: '30px'}}>Stop All</button> */}
                    </li>
                  ))}
                </ul>
                <br></br>
<br></br>
<label style={{ color: '#154775'}}><b>Recycle All Services:</b></label>
<button onClick={() => handleStopAll(item.ComputerName)} style={{marginLeft: '5px', background:'#b95d5d'}}>Stop All</button>
<button onClick={() => handleStartAll(item.ComputerName)} style={{marginLeft: '5px', background: '#0cb061'}}>Start All</button>
<button onClick={() => handleRestartAll(item.ComputerName)} style={{marginLeft: '5px',background:'#635279',width:'85px',height:'34px'}}>Restart All</button>
              </div>
              {/* <br></br>
<br></br>
<label style={{ color: '#154775'}}><b>Recycle All Services:</b></label>
<button onClick={() => handleStopAll(item.ComputerName)} style={{marginLeft: '10px', background:'#b95d5d'}}>Stop All</button> */}
              <br />
            </div>
          ))}
        </div>
      )}
      <br />
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || filteredData.length === 0}
          style={{
            color: currentPage === 1 || filteredData.length === 0 ? "gray" : "black",
            cursor: currentPage === 1 || filteredData.length === 0 ? "default" : "pointer",
          }}
        >
          {"<"}
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages || filteredData.length === 0}
          style={{
            color: currentPage === totalPages || filteredData.length === 0 ? "gray" : "black",
            cursor: currentPage === totalPages || filteredData.length === 0 ? "default" : "pointer",
          }}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};
 
export default Mrserverdetails;