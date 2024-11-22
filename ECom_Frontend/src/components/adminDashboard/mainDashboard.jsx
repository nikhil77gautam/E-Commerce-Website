import React from "react";
// import Nav from "../../components/sideNav/nav";
import Nav2 from "../../components/sideNav/nav2";
import ContentDashboard from "./contentDashboard";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen font-serif bg-gray-300">
      {" "}
      {/* Add a container with appropriate styling */}
      {/* <Nav /> */}
      <Nav2 />
      <ContentDashboard />
    </div>
  );
};

export default Dashboard;
