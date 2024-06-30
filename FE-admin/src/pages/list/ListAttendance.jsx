import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DataAttendance from "../../components/datatable/DataAttendance";

const ListAttendance = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <DataAttendance />
      </div>
    </div>
  );
};

export default ListAttendance;
