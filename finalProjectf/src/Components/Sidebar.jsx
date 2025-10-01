import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaFileAlt, FaChartBar, FaCog } from "react-icons/fa"; // blue styled icons
import "../Style/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <span className="sidebar-title">API <span className="title">Management</span> </span>
      <hr />
      <ul className="sidebar-menu">
        <li className="menu-item">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            <FaHome className="icon" /><span className="title">Home</span> 
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink to="/tracer" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaFileAlt className="icon" /> <span className="title">Tracer</span> 
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink to="/analytics" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaChartBar className="icon" /> <span className="title">Analysis</span> 
          </NavLink>
        </li>
        <li className="menu-item">
          <NavLink to="/config" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaCog className="icon" /><span className="title"> Configuration</span> 
          </NavLink>
        </li>
      </ul>
      <hr />
    </div>
  );
}

export default Sidebar;