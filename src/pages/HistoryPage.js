import React from "react";
import jsonData from './UserLogonevents.json';

const HistoryPage = () => {
    return (
    <div style={{margin:'20px'}}>
      <h2 style={{ marginLeft: "300px", fontSize: "20px" }}>Login History</h2>
      <br></br>
      <table style={{ height: "300px", overflowY: "inherit" }}>
        <thead style={{ background: "#908fb0" ,height:'30px'}}>
          <tr>
            <th>Event Time</th>
            <th>User</th>
            <th>Server</th>
            <th>Service</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
            <tr key={index}>
              <td>{item.Timelog}</td>
              <td>{item.User}</td>
              <td>{item.Machine}</td>
              <td>{item.Service}</td>
              <td>{item.Action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;

