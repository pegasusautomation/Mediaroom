import "../Table.css";
import React,{useState} from "react";
import servertable from "./ServerData.json";

const ITEMS_PER_PAGE = 2;
const Servertable = ({userData}) => {
  // role=userData.role
  // const handleClick = (e) => {
  //   e.Status === "Running"
  //     ? console.log("Running")
  //     : alert("Your server restarted successfully!");
  // };
    // role=userData.role
  // const handleClick = (e) => {
  //   e.Status === "Running"
  //     ? console.log("Running")
  //     : alert("Your server restarted successfully!");
  // };
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('Server_Name');

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setCurrentPage(1); // Reset current page when searching

    // Optional: You can apply debounce to limit the frequency of filter calls
    // debounceSearch(value);
  };

  const handleColumnChange = (event) => {
    setSearchColumn(event.target.value);
    setSearchTerm(''); // Clear search term when column changes
    setCurrentPage(1);
  }; 

  const filteredData = servertable.filter((item) => {
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
  
    // Convert the search value to a string
  //   const stringValue = String(searchValue);
  
  //   // Perform case-insensitive search
  //   return stringValue.toLowerCase().includes(searchTerm.toLowerCase());
  // });
  

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);

  const handlePreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages);
  };

  return (
    userData.role==="admin" ?
    // CURRENT_USER_TYPE===<div>{userData.role}</div> ?
    <div className="column">
          <caption className="caption">
            <b>
              <br></br>
              <br></br>SERVER DETAILS
            </b>
            <br></br>
            <br></br>
          </caption>
          <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
              <div style={{height:'20px'}}>
            {filteredData.length > 0 && (
            <select value={searchColumn} onChange={handleColumnChange} style={{ marginRight: '140px' }}>
          <option value="Server_Name">Server_Name</option>
          <option value="ISS_Status">ISS_Status</option>
          <option value="Server_ID">Server_ID</option>
          <option value="Server_Status">Server_Status</option>
          <option value="Static_Snapshot">Static_Snapshot</option>
        </select>
            )}
            </div>
            <input className="searchstyle"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ height: '20px', width: '200px', boxSizing: 'border-box' }}
      />
            </div>
          {filteredData.length === 0 && (
        <div style={{ textAlign: 'center', color: 'black' }}>No matching data found.</div>
      ) }
      {filteredData.length > 0 && (
        <table className="table" style={{marginRight:'120px'}}>
          <thead>
            <tr>
              {Object.keys(servertable[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
              {/* <th>{Action}</th> */}
            </tr>
          </thead>
        
          <tbody>
            {filteredData.slice(startIndex, endIndex).map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
                {/* <td>
                  <button onClick={() => handleClick(row)}>
                    {row.Status === "Restart" ? "Running" : "Restart"}
                  </button>
                </td> */}
              </tr>
             ))}
          </tbody>
        </table>
      )}
      <div style={{ textAlign: 'center', marginTop: '10px',marginRight:'150px' }}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1 || filteredData.length === 0} style={{ color: currentPage === 1 || filteredData.length === 0 ? 'gray' : 'black', cursor: currentPage === 1 || filteredData.length === 0 ? 'default' : 'pointer' }}>{'<'}</button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages || filteredData.length === 0} style={{ color: currentPage === totalPages || filteredData.length === 0 ? 'gray' : 'black' , cursor: currentPage === totalPages || filteredData.length === 0 ? 'default' : 'pointer'  }}>{'>'}</button>
      </div>
    </div>
    :<div>You are not Authorised</div>
  );
};

export default Servertable;
