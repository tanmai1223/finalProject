import React, { useEffect, useState, useRef } from "react";
import "../Style/index.css";
import "../Style/Config.css";
import Sidebar from "../Components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer } from "react-toastify"
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Controls from "../Components/Controls";
const API_URL = import.meta.env.VITE_API_URL;


function Config() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null); 
  const controlsRef = useRef();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/logs/control`);
      const data = await res.json();
      setLogs(data.data);
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Close Controls if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (controlsRef.current && !controlsRef.current.contains(event.target)) {
        setShowControls(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEllipsisClick = (endpoint) => { 
    setSelectedEndpoint(endpoint);
    setShowControls(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="main-content">
        <h1 className="heading">API List</h1>

        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>API Name</th>
                  <th>Start Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => {
                  const date = new Date(log.timestamp);
                  const formattedDate = date.toLocaleDateString("en-GB");
                  return (
                    <tr key={log._id || index}>
                      <td>{log.endpoint}</td>
                      <td>{formattedDate}</td>
                      <td className="ham">
                        <FontAwesomeIcon
                          icon={faEllipsisVertical}
                          onClick={() => handleEllipsisClick(log.endpoint)} 
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Controls modal on right-hand side */}
        {showControls && (
          <div ref={controlsRef} className="controls-alert">
            <Controls endpoints={selectedEndpoint} setShowControls={setShowControls}/> 
          </div>
        )}
      </div>
    </div>
  );
}

export default Config;