
import "C:/Mediaroom/src/Table.css";
import React from "react";
import certTable from "C:/Mediaroom/src/CertData.json";

const Certtable = () => {

  return (
    <div className="column">
      {certTable ? (
        <table className="table">
          <caption className="caption">
            <b>
              <br></br>
              <br></br>CERTIFICATE DETAILS
            </b>
            <br></br>
            <br></br>
          </caption>
          <thead>
            <tr>
              {Object.keys(certTable[0]).map((key, index) => (
                <th key={index}>{key}</th>
              ))}
              {/* <th>{Action}</th> */}
            </tr>
          </thead>
          <tbody>
            {certTable.map((row, rowIndex) => (
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
  );
};

export default Certtable;