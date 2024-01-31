import React, { useState, useEffect } from "react";
import "C:/Mediaroom/src/Table.css"
// import { useHistory } from "react-router-dom";

const LoginHistoryPage = () => {
    const [data, setData] = useState();
     // Fetch user login data to google sheet
        const getData = async () => {
            try {
              const res = await fetch(
                "https://sheet.best/api/sheets/da498c34-41c5-452d-bb1f-a8dab2e5ea4a"
              );
              const data = await res.json();
              console.log(data);
              setData(Object.keys(data).map((key) => data[key]));
            } catch (error) {
              console.log(error);
            }
          };
        
          useEffect(() => {
            getData();
          }, []);


          return (
            <div className="column">
              {data ? (
                <table className="table">
                  <caption className="caption">
                    <b>
                      <br></br>
                      <br></br>LOGIN HISTORY
                    </b>
                    <br></br>
                    <br></br>
                  </caption>
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key, index) => (
                        <th key={index}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
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

export default LoginHistoryPage;