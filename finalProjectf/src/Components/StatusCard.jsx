import React from "react";
import "../Style/StatusCard.css";

function StatusCard({ log }) {
  // Determine the class based on status code
  const getStatusClass = (status) => {
    if (status >= 200 && status<300  ) return "green";
    if (status >= 300 && status < 400) return "orange"; // all 3xx except 304
    if (status >= 400 && status < 600) return "red"; // 4xx and 5xx
    if (status >= 100 && status < 200) return "yellow"; // 1xx
    return ""; // default
  };

  return (
    <div className="statusbar">
      <div className={getStatusClass(log.status)}></div>
    </div>
  );
}

export default StatusCard;