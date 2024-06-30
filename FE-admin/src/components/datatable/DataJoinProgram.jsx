import "./datajoinprogram.scss";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../configs/app.config"; // Assuming BASE_URL is correctly defined

const DataJoinProgram = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null); // State for detailed program info
  const [reload, setReload] = useState(false); // State to trigger reload

  useEffect(() => {
    fetchJoinPrograms();
  }, [reload]); // Reload whenever 'reload' changes

  const fetchJoinPrograms = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(`${BASE_URL}/join-program/get-join-programs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const joinPrograms = response.data.joinPrograms.map((program) => ({
        id: program._id,
        programId: program.programId,
        mssv: program.MSSV,
        status: program.status,
        registrationDate: new Date(program.registrationDate).toLocaleString(),
        joiningDate: program.joiningDate ? new Date(program.joiningDate).toLocaleString() : 'N/A',
        createdAt: new Date(program.createdAt).toLocaleString(),
        updatedAt: new Date(program.updatedAt).toLocaleString(),
      }));

      setData(joinPrograms);
    } catch (error) {
      console.error("Error fetching join programs:", error);
      setError("Failed to fetch join programs");
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(`${BASE_URL}/join-program/get-join-program/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSelectedProgram(response.data.joinProgram);
    } catch (error) {
      console.error("Error fetching join program details:", error);
      // Handle error or show error message
    }
  };

  const handleAttendance = async (programId, mssv) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/join-program/attendance/${programId}`,
        { MSSV: mssv },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = data.map((item) =>
        item.id === programId ? { ...item, status: 'ATTENDED' } : item
      );
      setData(updatedData);

      console.log("Attendance marked successfully:", response.data);
      setReload(!reload); // Toggle reload state
    } catch (error) {
      console.error("Error marking attendance:", error);
      // Handle error or show error message
    }
  };

  const handleAbsent = async (programId, mssv) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/join-program/absent/${programId}`,
        { MSSV: mssv },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = data.map((item) =>
        item.id === programId ? { ...item, status: 'ABSENT' } : item
      );
      setData(updatedData);

      console.log("Marked absent successfully:", response.data);
      setReload(!reload); // Toggle reload state
    } catch (error) {
      console.error("Error marking absent:", error);
      // Handle error or show error message
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "programId", headerName: "Mã chương trình", width: 250 },
    { field: "mssv", headerName: "MSSV", width: 150 },
    { 
      field: "status", 
      headerName: "Trạng thái", 
      width: 150,
      renderCell: (params) => (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      )
    },
    { field: "registrationDate", headerName: "Ngày đăng ký", width: 200 },
    { field: "joiningDate", headerName: "Ngày tham gia", width: 200 },
    { field: "createdAt", headerName: "Ngày tạo", width: 180 },
    { field: "updatedAt", headerName: "Ngày update", width: 180 },
    {
      field: "action",
      headerName: "Chức năng",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          {/* <div className="viewButton" onClick={() => handleViewDetails(params.row.id)}>
            View
          </div> */}
          <div className="attendanceButton" onClick={() => handleAttendance(params.row.programId, params.row.mssv)}>
            Điểm danh
          </div>     
          <div className="absentButton" onClick={() => handleAbsent(params.row.programId, params.row.mssv)}>
            Vắng mặt
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Đăng ký/Tham gia
        {/* <Link to="/join-programs/create" className="link">
          Add New
        </Link> */}
      </div>
      {error && <div className="error">{error}</div>}
      <DataGrid
        className="datagrid"
        rows={data}
        columns={columns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />

      {selectedProgram && (
        <div className="detailedProgram">
          <h3>Detailed Program Information</h3>
          <p><strong>ID:</strong> {selectedProgram._id}</p>
          <p><strong>Mã chương trình:</strong> {selectedProgram.programId}</p>
          <p><strong>MSSV:</strong> {selectedProgram.MSSV}</p>
          <p><strong>Trạng thái:</strong> {selectedProgram.status}</p>
          <p><strong>Ngày đăng ký:</strong> {new Date(selectedProgram.registrationDate).toLocaleString()}</p>
          <p><strong>Ngày tham gia:</strong> {selectedProgram.joiningDate ? new Date(selectedProgram.joiningDate).toLocaleString() : 'N/A'}</p>
          {/* Display other details as needed */}
        </div>
      )}
    </div>
  );
};

export default DataJoinProgram;
