import React, { useState } from "react";
import jsonData from "./mrserverdata.json";
import "../Table.css";

const ITEMS_PER_PAGE = 3;

const Mrserverdetails = ({userData}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('ComputerName');

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
    userData.role==="admin" ?
    <div className="column">
       <caption className="caption" style={{ marginTop: '180px'}}>
            <b>
              <br></br>
              <br></br>PLANO SERVERS
              <br></br>
            </b>
          </caption>
          <br></br>
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center'}}>
              <div style={{height:'20px'}}>
            {filteredData.length > 0 && (
            <select value={searchColumn} onChange={handleColumnChange} style={{ marginRight: '140px' }}>
          <option value="ComputerName">ComputerName</option>
          <option value="Roles">Role</option>
          <option value="ComputerStatus">ComputerStatus</option>
          <option value="ServiceStatus">ServiceStatus</option>
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
      <table className="table">
        <thead>
          <tr>
            <th>Computer Name</th>
            <th>Roles</th>
            <th>Computer Status</th>
            <th>Service Status</th>
          </tr>
        </thead>
        <tbody style={{ marginRight: '100px'}}>
          {filteredData.slice(startIndex, endIndex).map((item, index) => (
            <tr key={index}>
              <td>{item.ComputerName}</td>
              <td>
                <ul>
                  {item.Roles.map((role, roleIndex) => (
                    <li key={roleIndex}>
                      <strong>Name:</strong> {role.Name}, <strong>Type:</strong>{" "}
                      {role.Type}
                    </li>
                  ))}
                </ul>
              </td>
              <td>{item.ComputerStatus}</td>
              <td>
                <ul>
                  {item.ServiceStatus.map((role, roleIndex) => (
                    <li key={roleIndex}>
                      <strong>Name:</strong> {role.Name}, <strong>Status:</strong>{" "}
                      {role.Status}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
       <div style={{ textAlign: 'center', marginTop: '10px',marginRight:'150px' ,marginBottom:'60px'}}>
        <button onClick={handlePreviousPage} disabled={currentPage === 1 || filteredData.length === 0} style={{ color: currentPage === 1 || filteredData.length === 0 ? 'gray' : 'black', cursor: currentPage === 1 || filteredData.length === 0 ? 'default' : 'pointer' }}>{'<'}</button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages || filteredData.length === 0} style={{ color: currentPage === totalPages || filteredData.length === 0 ? 'gray' : 'black' , cursor: currentPage === totalPages || filteredData.length === 0 ? 'default' : 'pointer'  }}>{'>'}</button>
      </div>
    </div>
    :<div>You are not Authorised</div>
  );
};

export default Mrserverdetails;