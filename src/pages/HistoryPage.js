import React from "react";
import jsonData from './UserLogonevents.json';

const HistoryPage = () => {
    return (
    <div style={{margin:'20px', display: "flex",
    flexDirection: "column",
    alignItems: "center", // Align items to the center
    width: "100%",
    height: "80%",
    overflow: "auto",}}>
      <caption style={{ fontSize: "30px", marginBottom: "20px" }}>
        USER EVENT LOGS
      </caption>
      <br></br>
      <table style={{ height: "300px", overflowY: "inherit" }}>
        <thead style={{ background: "#908fb0" ,height:'30px'}}>
          <tr>
            <th>Event Time</th>
            <th>User</th>
            <th>Server</th>
            <th>Service</th>
            <th>Action</th>
            <th>Activity History</th>
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
              <td>{item.ActionHistory}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;

