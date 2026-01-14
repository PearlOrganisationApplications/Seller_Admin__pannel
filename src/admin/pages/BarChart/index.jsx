import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
} from "recharts";

const data = [
  { name: "Page A", uv: 400 },
  { name: "Page B", uv: 200 },
];

const pieData = [
  { name: "Page A", uv: 590 },
  { name: "Page B", uv: 590 },
  { name: "Page C", uv: 868 },
];

const BarCharts = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Bar Chart */}
      <BarChart width={500} height={300} data={data}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip wrapperStyle={{ width: 100, backgroundColor: "#ccc" }} />
        <Legend
          width={100}
          wrapperStyle={{
            top: 40,
            right: 20,
            backgroundColor: "#f5f5f5",
            border: "1px solid #d5d5d5",
            borderRadius: 3,
            lineHeight: "40px",
          }}
        />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="uv" fill="#8884d8" barSize={30} />
      </BarChart>

      {/* Pie Chart */}
      <PieChart width={400} height={400} style={{ marginTop: "50px" }}>
        <Pie
          data={pieData}
          dataKey="uv"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#82ca9d"
        />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default BarCharts;
