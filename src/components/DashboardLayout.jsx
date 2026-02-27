import React from "react";
import { Link } from "react-router-dom";

const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "220px",
        background: "#1e293b",
        color: "white",
        padding: "20px"
      }}>
        <h2>ExpenseApp</h2>
        <nav style={{ marginTop: "30px" }}>
          <div><Link to="/analytics" style={{ color: "white", textDecoration: "none" }}>Analytics</Link></div>
          <div style={{ marginTop: "15px" }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Logout</Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px", background: "#f1f5f9" }}>
        {children}
      </div>

    </div>
  );
};

export default DashboardLayout;