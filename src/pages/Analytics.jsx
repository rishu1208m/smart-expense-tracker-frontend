import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";   // ✅ Added

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8080/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        params: { startDate, endDate },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));
  }, [startDate, endDate]);

  if (!data) return <p>Loading...</p>;

  const categoryData = Object.entries(data.categoryTotals).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  const monthlyData = Object.entries(data.monthlyTotals).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  return (
    <DashboardLayout>   {/* ✅ Wrapped with layout */}
      <div style={{ padding: "20px" }}>
        <h2>Total Amount: ₹{data.totalAmount}</h2>
        <h3>Total Expenses: {data.totalExpenses}</h3>

        <h3>AI Insight:</h3>
        <p>{data.insight}</p>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ marginLeft: "10px" }}
          />
        </div>

        <h3>Category Breakdown</h3>
        <PieChart width={400} height={300}>
          <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100}>
            {categoryData.map((entry, index) => (
              <Cell key={index} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <h3 style={{ marginTop: "30px" }}>Monthly Expenses</h3>
        <BarChart width={500} height={300} data={monthlyData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" />
        </BarChart>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;