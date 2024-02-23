import React from "react";
import jsonData from "./mrserverdata.json";

const Mrserverdetails = () => {
  return (
    <div>
      <h2>Computer Roles</h2>
      <table>
        <thead>
          <tr>
            <th>Computer Name</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {jsonData.map((item, index) => (
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Mrserverdetails;
