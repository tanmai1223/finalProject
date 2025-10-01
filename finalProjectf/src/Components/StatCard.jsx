import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function StatCard({ title, value, displayText, extra, color }) {
  // Ensure value for the circle is between 0–100
  const circleValue = Math.min(Math.max(value, 0), 100);
  

  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <div className="stat-circle">
        <CircularProgressbar
          value={circleValue}
          text={displayText}
          strokeWidth={8}
          styles={buildStyles({
            pathColor: color,
            textColor: "#fff",
            trailColor: "#222",
            textSize: "15px",
          })}
        />
      </div>
      {extra && <p className="stat-extra">{extra}</p>}
    </div>
  );
}



export default StatCard;