import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';

const DownloadCSVIcon = ({ data, filename }) => {
  const downloadCSV = () => {
    const csvData = data.map(cert => {
      return Object.values(cert).join(",");
    }).join("\n");

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, filename);
  };

  return (
    <div
      onClick={downloadCSV}
      style={{
        cursor: 'pointer',
        display: 'inline-block',
        padding: '4px 8px',
        backgroundColor: '#4CAF50',
        color: 'white',
        borderRadius: '4px',
        textDecoration: 'none',
        textAlign: 'center'
      }}
      title="Download Cert Details"
    >
      <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
      Download Report
    </div>
  );
};

export default DownloadCSVIcon;
