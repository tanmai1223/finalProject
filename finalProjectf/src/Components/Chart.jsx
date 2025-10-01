import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Chart({ data }) {
  // Format data: extract day manually to avoid timezone shifts
  const formattedData = data.map((item) => {
    const dateStr = item.date.split("T")[0]; // "YYYY-MM-DD"
    const [year, month, day] = dateStr.split("-");
    return {
      ...item,
      day: parseInt(day, 10), // X-axis: day number
      fullDate: `${day}-${month}-${year}`, // tooltip: readable date
    };
  });

  return (
    <div style={{ marginTop: "40px", width: "100%", height: 250 }}>
      <ResponsiveContainer>
        <AreaChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#4CAF50" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ccc" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" stroke="#0075FF" /> {/* shows day numbers */}
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            stroke="#0075FF"
          />
          <Tooltip
            formatter={(v) => `${v.toFixed(2)}%`}
            labelFormatter={(label, payload) => payload[0]?.payload?.fullDate || label}
          />
          <Area
            type="monotone"
            dataKey="uptimePercent"
            stroke="#0075FF"
            strokeWidth={2}
            fill="#0075FF"
            dot={{ r: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;