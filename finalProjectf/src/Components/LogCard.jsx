import React from "react";
import "../Style/LogCard.css";

function LogCard({ log }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${day}-${month}-${year} - ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="logCard">
        <div className="logHeader">
          <span className="traceId">{log.traceId}</span> ➜{" "}
          <span className="method">{log.method}</span> {log.endpoint}
        </div>

        <div className="logBody">
          {Array.isArray(log.logs) ? (
            log.logs.map((item, index) => (
              <div key={index} className="logEntry">
                <p className="timestamp">{formatTimestamp(item.timestamp)}</p>
                <p className="type">{item.type}</p>
                <p className="message">{item.message}</p>
              </div>
            ))
          ) : (
            <p className="noLogs">No logs available</p>
          )}
        </div>

        <div className="logFooter">
          <span className="status">Status: {log.status}</span>
          <span className="responseTime">{log.responseTimeMs} ms</span>
        </div>
      </div>
   
  );
}

export default LogCard;