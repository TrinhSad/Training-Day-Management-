import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { BASE_URL } from "../../configs/app.config";

const DataAttendance = () => {
  const { programId } = useParams();
  const [joinProgram, setJoinProgram] = useState([]);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0); // State để đếm số lần load lại

  useEffect(() => {
    const fetchJoinProgramData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${BASE_URL}/join-program/get-join-program-by-program/${programId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Thêm thuộc tính id vào mỗi đối tượng trong joinProgram
        const rowsWithIds = response.data.joinProgram.map((row) => ({
          ...row,
          id: row._id, // Sử dụng _id làm id
        }));

        setJoinProgram(rowsWithIds);
      } catch (error) {
        setError("Failed to fetch join program details");
        console.error("Error fetching join program details:", error);
      }
    };

    fetchJoinProgramData();
  }, [programId, reloadCount]); // Thêm reloadCount vào dependency để reload khi reloadCount thay đổi

  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "MSSV", headerName: "MSSV", width: 150 },
    { field: "fullName", headerName: "Họ và tên", width: 300 },
    { field: "point", headerName: "Điểm số", width: 150 },
  ];

  const actionColumn = {
    field: "actions",
    headerName: "Chức năng",
    width: 200,
    renderCell: (params) => (
        <div className="cellAction">
          <div className="attendanceButton" onClick={() => handleAttendance(programId, params.row.MSSV)}>
            Điểm danh
          </div>     
          <div className="absentButton" onClick={() => handleAbsent(programId, params.row.MSSV)}>
            Vắng mặt
          </div>
          
        </div>
    ),
  };

  const handleAttendance = async (programId, MSSV) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/join-program/attendance/${programId}`,
        { MSSV: MSSV }, // Truyền MSSV vào body của request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật trạng thái điểm danh trong local state
      const updatedJoinProgram = joinProgram.map((item) =>
        item.id === response.data._id ? { ...item, status: "Đã điểm danh" } : item
      );
      setJoinProgram(updatedJoinProgram);

      console.log("Điểm danh thành công:", response.data);
      setReloadCount((prevCount) => prevCount + 1); // Tăng reloadCount để load lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi điểm danh:", error);
      // Xử lý lỗi hoặc hiển thị thông báo lỗi
    }
  };

  const handleAbsent = async (programId, MSSV) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/join-program/absent/${programId}`,
        { MSSV: MSSV }, // Truyền MSSV vào body của request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật trạng thái vắng mặt trong local state
      const updatedJoinProgram = joinProgram.map((item) =>
        item.id === response.data._id ? { ...item, status: "Vắng mặt" } : item
      );
      setJoinProgram(updatedJoinProgram);

      console.log("Đánh dấu vắng mặt thành công:", response.data);
      setReloadCount((prevCount) => prevCount + 1); // Tăng reloadCount để load lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi đánh dấu vắng mặt:", error);
      // Xử lý lỗi hoặc hiển thị thông báo lỗi
    }
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Sinh viên
      </div>
      <DataGrid
        className="datagrid"
        rows={joinProgram}
        columns={columns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
        checkboxSelection
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default DataAttendance;
