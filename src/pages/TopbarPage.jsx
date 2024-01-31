import React, { useState } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";
import HomePage from "./HomePage";
import Servertable from "C:/Mediaroom/src/manageserver/servertable.js";
import LoginPage from "./LoginPage";
import { useHistory } from "react-router-dom";
import "C:/Mediaroom/src/pages/topbar.css"

const Topbar = ({ username, onLogout, props }) => {
  const history = useHistory();
  const handleSubmit = () => {
    history.push("/LoginPage");
    window.location.reload();
  };

  return (
    <div className="topbar">
      <span>
        Welcome, <strong>{username}</strong>
      </span>

      <button type="submit" onClick={handleSubmit}>
        Log out
      </button>
    </div>
  );
};

export default Topbar;
