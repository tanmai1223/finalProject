import React, { useEffect, useState } from "react";
import "../Style/index.css";
import Sidebar from "../Components/Sidebar";
import LogCard from "../Components/LogCard";
const API_URL = import.meta.env.VITE_API_URL;


function Tracer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDate = (timestamp) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const logDate = new Date(timestamp);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (isSameDay(logDate, today)) {
      return "Today";
    }
    if (isSameDay(logDate, yesterday)) {
      return "Yesterday";
    }
    return logDate.toLocaleDateString();
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/logs`);
      const data = await res.json();

      
      const groupedLogs = data.data.reduce((groups, log) => {
        const timestamp =log.logs?.[0]?.timestamp;          
        if (timestamp) {
          const date = formatDate(timestamp);
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(log);
        }
        return groups;
      }, {});
      //console.log(groupedLogs);
      setLogs(groupedLogs);
    } catch (error) {
      console.log("Error is", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <span className="heading">API Trace Logs</span>
        <div className="display-tracer">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {Object.keys(logs).map((date) => (
              <div key={date}>
                <p className="date-heading">{date}</p>
                {logs[date].map((log) => (
                  <LogCard key={log._id} log={log} />
                ))}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
}

export default Tracer;