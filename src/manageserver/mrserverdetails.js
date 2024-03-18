import React, { useState} from "react";
import jsonData from "./mrserverdata.json";
import "../grid.css";

const ITEMS_PER_PAGE = 2;
// const ROW_HEIGHT = 120;

const Mrserverdetails = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("ComputerName");
  // const [filteredData, setFilteredData] = useState(jsonData);
  // const containerRef = useRef(null); //added now

  //added now
  // const scrollUp = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop -= ROW_HEIGHT;
  //   }
  // };

  // const scrollDown = () => {
  //   if (containerRef.current) {
  //     containerRef.current.scrollTop += ROW_HEIGHT;
  //   }
  // };
 
  const handleStop = (role) => {
    
    const jsonServiceInfo = JSON.stringify(role);
    console.log(jsonServiceInfo) 
    
    // Add logic to handle stop action
    fetch('/stop-service', { method: 'POST', body: jsonServiceInfo, headers: { 'Content-Type': 'application/json' } })
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
    alert("Service stopped");
    console.log("Stop action for index:", role);
  };
  
  const handleStart = (role) => {
    
    const jsonServiceInfo = JSON.stringify(role);
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
      alert("service restarted");
      console.log("Restart action for index:", role);
  };

  const handleRestart = (role) => {
    
    const jsonServiceInfo = JSON.stringify(role);
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
      console.log("Restart action for index:", role);
  };

  // useEffect(() => {
  //   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  
  //   const handleKeyDown = (event) => {
  //     if (event.key === "ArrowRight" && currentPage < totalPages) {
  //       handleNextPage();
  //     } else if (event.key === "ArrowLeft" && currentPage > 1) {
  //       handlePreviousPage();
  //     } else if (event.key === "ArrowUp") {
  //       scrollUp();
  //     } else if (event.key === "ArrowDown") {
  //       scrollDown();
  //     }
  //   };
  
  //   document.addEventListener("keydown", handleKeyDown);
  
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [currentPage, filteredData,handleNextPage]); // Include handleNextPage in the dependency array
  
  // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset current page when searching
    // filterData(value);
  };

  const handleColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchTerm(''); // Clear search term when column changes
    setCurrentPage(1);
  }; 
  const filteredData = jsonData.filter((item) => {
    const searchValue = item[searchColumn];

    // Handle filtering by other columns
    if (typeof searchValue === 'string') {
      return searchValue.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (typeof searchValue === 'number' && !isNaN(searchValue)) {
      // Handle filtering for numbers
      return searchValue === parseFloat(searchTerm);
    } else {
      // Handle other data types (e.g., booleans)
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
    <div style={{display:'flex',justifyContent:'center',alignContent:'center',flexDirection:'column',width:'1108px',height:'520px',marginBottom:'10px',overflow:'auto'}}>
      <caption style={{fontSize:'30px',marginLeft:'-80px'}} >PLANO SERVERS</caption>
      <div style={{ alignItems: 'center' }}>
          {filteredData.length > 0 && (
            <select
              value={searchColumn}
              onChange={handleColumnChange}
              style={{marginLeft:'220px',width:'120px'}}
            >
              <option value="ComputerName">ComputerName</option>
              {/* <option value="Roles">Role</option> */}
              <option value="ComputerStatus">ComputerStatus</option>
              <option value="ServiceStatus">ServiceStatus</option>
            </select>
          )}
        <input
          className="searchstyle"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ height: '20px', width: '200px', boxSizing: 'border-box',marginLeft:'350px'}}
        />
      </div>
     <br></br>
      {filteredData.length > 0 && (
        //add ref={containerRef} in div for auto keys scroll
        <div  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridGap: '15px' ,overflowY:'inherit',overflowX: "hidden",}}>
          {filteredData.slice(startIndex, endIndex).map((item, index) => (
            <div key={index} className="grid-item">
              <div>
                <strong style={{color:'#154775'}}>Computer Name:</strong> {item.ComputerName}
              </div>
              <br></br>
              <div>
                <strong style={{color:'#154775'}}>Roles:</strong>
                <ul>
                  {item.Roles.map((role, roleIndex) => (
                    <li key={roleIndex}>
                      <strong>Name:</strong> {role.Name},{" "}
                      <strong>Type:</strong> {role.Type}
                    </li>
                  ))}
                </ul>
              </div>
              <br></br>
              <div>
                <strong style={{color:'#154775'}} >Computer Status:</strong> {item.ComputerStatus}
              </div>
              <br></br>
              <div>
                <strong style={{color:'#154775'}}>Service Status:</strong>
                <ul>
                  {item.ServiceStatus.map((role, roleIndex) => (
                    <li key={roleIndex}>
                      
                      <strong>Name:</strong> {role.Name},{" "}
                      <br></br>
                      <strong>Status:</strong> <span style={{ color: role.Status === "Stopped" ? "red" : "green" ,marginRight:'150px'}}>{role.Status}</span>
                      {role.Status === "Stopped" ? (
      <button onClick={() => handleStart(role)} style={{marginRight: '10px', background:'#0cb061',padding:'2px'}}>Start</button>
    ) : (
      <>
        <button onClick={() => handleStop(role)} style={{marginRight: '10px', background:'#b95d5d'}}>Stop</button>
        <button onClick={() => handleRestart(role)} style={{background:'#635279'}}>Restart</button>
      </>
    )}
                      {/* <span style={{ color: role.Status === "Stopped" ? "red" : "green" }}></span> */}
                    </li>
                  ))}
                </ul>
              </div>
              <br></br>
              {/* <div>
                <button onClick={() => handleStart(index)} style={{marginRight: '5px',background:'green',height:'2px'}}>Start</button>
                <button onClick={() => handleStop(index)} style={{marginRight: '5px',background:'#b95d5d'}}>Stop</button>
                <button onClick={() => handleRestart(index)} style={{background:'#154775'}}>Restart</button>
              </div> */}
            </div>
          ))}
        </div>
      )}
      <br></br>
      <div
       style={{ textAlign: 'center'}}
      >
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || filteredData.length === 0}
          style={{
            color:
              currentPage === 1 || filteredData.length === 0
                ? "gray"
                : "black",
            cursor:
              currentPage === 1 || filteredData.length === 0
                ? "default"
                : "pointer",
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
            color:
              currentPage === totalPages || filteredData.length === 0
                ? "gray"
                : "black",
            cursor:
              currentPage === totalPages || filteredData.length === 0
                ? "default"
                : "pointer",
          }}
        >
          {">"}
        </button>
      </div>
      
    </div>
  );
};

export default Mrserverdetails;