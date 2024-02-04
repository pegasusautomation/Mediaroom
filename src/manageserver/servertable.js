import "../Table.css";
import React from "react";
import servertable from "./ServerData.json";

const Servertable = ({userData}) => {
  // role=userData.role
  // const handleClick = (e) => {
  //   e.Status === "Running"
  //     ? console.log("Running")
  //     : alert("Your server restarted successfully!");
  // };

  return (
    userData.role==="admin" ?
    // CURRENT_USER_TYPE===<div>{userData.role}</div> ?
    <div className="column">
      {servertable ? (
        <table className="table">
          <caption className="caption">
            <b>
              <br></br>
              <br></br>SERVER DETAILS
            </b>
            <br></br>
            <br></br>
          </caption>
          <thead>
            <tr>
              {Object.keys(servertable[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
              {/* <th>{Action}</th> */}
            </tr>
          </thead>
          <tbody>
            {servertable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell, cellIndex) => (
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
      ) : (
        <p>Loading...</p>
      )}
    </div>
    :<div>You are not Authorised</div>
  );
};

export default Servertable;
