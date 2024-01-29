import React, { useState } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./HomePage";
import Servertable from "C:/Mediaroom/src/manageserver/servertable.js";
import LoginPage from "./LoginPage";
import { useHistory } from "react-router-dom";

const Topbar = ({ username, onLogout, props }) => {
  // const toggleForm = (formName) => {
  //   //   setCurrentForm(formName);
  //     setCurrentPage(formName);
  //   }
  const history = useHistory();
  const handleSubmit = () => {
    // alert("You clicked me!")

    history.push("/LoginPage");
    window.location.reload();
  };

  return (
    <div style={styles.topbar}>
      <span>
        Welcome, <strong>{username}</strong>
      </span>
      {/* <button onClick={() => props.onFormSwitch('LoginPage')} style={styles.logoutButton}>Logout</button> */}

      <button type="submit" onClick={handleSubmit}>
        Log Out
      </button>
    </div>
  );
};

const styles = {
  topbar: {
    backgroundColor: "#333",
    color: "white",
    padding: "10px",
    textAlign: "right",
  },
  logoutButton: {
    color: "white",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    marginLeft: "20px",
  },
};

export default Topbar;
