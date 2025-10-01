import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Sidebar from "../Components/Sidebar";
import "../Style/Analytics.css";
import StatCard from "../Components/StatCard";
import Chart from "../Components/Chart";
const API_URL = import.meta.env.VITE_API_URL;


function Analytics() {
  const [date, setDate] = useState(new Date());
  const [info, setInfo] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/logs/analysis?year=${year}&month=${month}`
      );
      const data = await res.json();
      setInfo(data);
    } catch (error) {
      console.error("Error fetching info:", error);
      setInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

    try {
      const res = await fetch(
        `${API_URL}/api/logs/chart?year=${year}&month=${month}`
      );
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.log("Error fetching chart data:", error);
      setChartData([]);
    }
  };

  useEffect(() => {
    fetchInfo(date);
    fetchData(date);
  }, [date]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"; // 1,200,000 → 1.2M
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k"; // 10,232 → 10.2k
    } else {
      return num.toString();
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <p className="heading">Analysis</p>

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

        {/* Dashboard Stats */}
        <div className="dashboard">
          {loading ? (
            <p>Loading...</p>
          ) : info ? (
            <>
              <StatCard
                title="Uptime (Per Month)"
                value={info?.uptimePercent || 0}
                displayText={`${Math.round(info?.uptimePercent * 10) / 10}%`}
                extra={
                  info?.lastErrorTimestamp
                    ? `Last downtime: ${new Date(
                        info.lastErrorTimestamp
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}`
                    : "Last downtime: -"
                }
                color="#00FFA3"
              />

              <StatCard
                title="Total Response Time"
                value={Math.min(info?.totalResponseTime || 0, 100)}
                displayText={
                  info?.totalResponseTime
                    ? `${formatNumber(
                        Math.round(info.totalResponseTime * 10) / 10
                      )} ms`
                    : "-"
                }
                extra={
                  info?.avgResponseTime
                    ? `Average Response Time: ${
                        Math.round(info.avgResponseTime * 10) / 10
                      } ms`
                    : "-"
                }
                color="#0080FF"
              />

              <StatCard
                title="Request Volume (Per Month)"
                value={Math.min((info?.totalRequests || 0) / 10, 100)}
                displayText={formatNumber(info?.totalRequests) ?? 0}
                extra={
                  info?.totalRequests
                    ? `Request per week :  ${Math.round(
                        info.totalRequests / 4
                      )} requests`
                    : "-"
                }
                color="#FFD700"
              />

              <StatCard
                title="Error Rate (Per Month)"
                value={info?.errorPercent || 0}
                displayText={`${Math.round(info?.errorPercent * 10) / 10}%`}
                extra={`Most common error: ${
                  info?.maxErrorStatus?._id ?? "-"
                } (${info?.maxErrorStatus?.count ?? "-"} Times)`}
                color="#FF4C4C"
              />
            </>
          ) : (
            <p>No data available for selected month.</p>
          )}
        </div>

        {/* Chart Section */}
        <div className="chart-section">
          <h3 className="chart-sectionh3">Uptime Percentage Over Time</h3>
          <Chart data={chartData} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;