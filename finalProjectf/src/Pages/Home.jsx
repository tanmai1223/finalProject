import React, { useState, useEffect, useRef } from "react";
import "../Style/index.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../Components/Sidebar";
import StatusCard from "../Components/StatusCard";
import "../Style/StatusCard.css";
const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const [date, setDate] = useState(new Date());
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ref to store multiple container refs
  const containerRefs = useRef({});

  const fetchLogs = async (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/logs/time?year=${year}&month=${month}`
      );
      const data = await res.json();
      setLogs(data.data);
    } catch (error) {
      console.log("Error : ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(date);
  }, [date]);

  useEffect(() => {
    // Scroll each container to the end when logs update
    Object.keys(containerRefs.current).forEach((key) => {
      const container = containerRefs.current[key];
      if (container) {
        container.scrollLeft = container.scrollWidth;
      }
    });
  }, [logs]);

  const getStatusIcon = (status) => {
    if (status === 200 ) {
      return "✔️";
    } else if (status >= 200 && status < 600) {
      return "❌";
    }
    return "";
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <p className="heading">Home</p>
        <div className="calendar-card">
          <label className="calendar-label">
            System Status &nbsp;:&nbsp;&nbsp;&lt;&nbsp;
          </label>
          <DatePicker
            selected={date}
            onChange={(d) => setDate(d)}
            dateFormat="MMM yyyy"
            showMonthYearPicker
            className="month-picker"
          />
          <span>&nbsp;&gt;</span>
        </div>

        <div className="display">
          {loading ? (
            <p>Loading...</p>
          ) : Object.keys(logs).length === 0 ||
            Object.values(logs).every((arr) => arr.length === 0) ? (
            <p>No data for this month.</p>
          ) : (
            <div>
              {Object.keys(logs).map((baseEndpoint) => (
                <div key={baseEndpoint} className="status-container-wrapper">
                  <p className="date-heading">{baseEndpoint}</p>
                  <div
                    className="status-container"
                    ref={(el) => (containerRefs.current[baseEndpoint] = el)}
                  >
                    {logs[baseEndpoint].map((log) => (
                      <StatusCard key={log.traceId} log={log} />
                    ))}
                  </div>
                  {logs[baseEndpoint].length > 0 && (
                    <span className="status-icon">
                      {getStatusIcon(
                        logs[baseEndpoint][logs[baseEndpoint].length - 1].status
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;