import React, { useState } from "react";
import "./ConfirmationPopup.css"; // Import CSS file for styling

const ConfirmationPopup = ({ onCancel, onConfirm }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="confirmation-popup-overlay">
      <div className="confirmation-popup-content">
        <p>Are you sure you want to proceed?</p>
        <textarea
  value={inputValue}
  onChange={handleInputChange}
  placeholder="Reason for recycling service..."
  minLength={15}  // Minimum character limit
  maxLength={200} // Maximum character limit
  style={{
    marginBottom: '10px',
    padding: '8px', // Adjusted padding
    fontSize: '16px', // Adjusted font size
    width: '100%', // Set the width to fill the container
    minHeight: '100px', // Set a minimum height to prevent it from collapsing
    resize: 'vertical', // Allow vertical resizing
    boxSizing: 'border-box' // Include padding and border in the width calculation
  }}
/>
        <div className="button-container">
          <button onClick={() => onConfirm(inputValue)} style={{ marginRight: '10px', background: '#594c91', padding: '6px' }}>Confirm</button>
          <button onClick={onCancel} style={{ background: '#484545', padding: '6px' }}>Cancel</button>
        </div>
      </div>
    </div>
  );  
};

export default ConfirmationPopup;
