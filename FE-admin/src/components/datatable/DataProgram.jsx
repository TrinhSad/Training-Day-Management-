import "./dataprogram.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../configs/app.config"; // Assuming BASE_URL is correctly defined

const DataProgram = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [detailedProgram, setDetailedProgram] = useState(null); // State for detailed program info
  const [role, setRole] = useState(""); // State to store the user's role

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    setRole(userRole || ''); // Retrieve the role from sessionStorage
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(`${BASE_URL}/program/get-all-program`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const programs = response.data.programs.map(program => ({
        id: program._id,
        programName: program.programName,
        description: program.description,
        quantity: program.quantity,
        status: program.status,
        image: program.image,
        startDate: new Date(program.startDate).toLocaleString(),
        registerDate: new Date(program.registerDate).toLocaleString(),
        point: program.point,
        createdAt: new Date(program.createdAt).toLocaleString(),
        updatedAt: new Date(program.updatedAt).toLocaleString(),
      }));

      setData(programs);
    } catch (error) {
      console.error('Error fetching programs:', error);
      setError('Failed to fetch programs');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.get(`${BASE_URL}/program/get-program/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setDetailedProgram(response.data.program);
    } catch (error) {
      console.error('Error fetching program details:', error);
      // Handle error or show error message
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.put(`${BASE_URL}/program/approve-program/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update status in the local data state after approval
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, status: 'APPROVED' } : item
      );
      setData(updatedData);

      console.log('Program approved successfully:', response.data);
    } catch (error) {
      console.error('Error approving program:', error);
      // Handle error or show error message
    }
  };

  const handleReject = async (id) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await axios.put(`${BASE_URL}/program/reject-program/${id}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Update status in the local data state after rejection
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, status: 'REJECTED' } : item
      );
      setData(updatedData);

      console.log('Program rejected successfully:', response.data);
    } catch (error) {
      console.error('Error rejecting program:', error);
      // Handle error or show error message
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 220 },
    { field: 'programName', headerName: 'Tên chương trình', width: 250 },
    { field: 'description', headerName: 'Mô tả', width: 300 },
    { field: 'quantity', headerName: 'Số lượng SV', width: 100 },

    { field: 'image', headerName: 'Ảnh mô tả', width: 100, renderCell: (params) => (
        <img src={params.row.image} alt="Program" style={{ width: 50, height: 50 }} />
    )},
    { field: 'startDate', headerName: 'Ngày tham gia', width: 180 },
    { field: 'registerDate', headerName: 'Ngày mở đăng ký', width: 180 },
    { field: 'point', headerName: 'Điểm', width: 80 },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 120,
      renderCell: (params) => (
        <div className={`cellWithStatus status-${params.row.status}`}>
          {params.row.status}
        </div>
      ),
    },
    { field: 'createdAt', headerName: 'Ngày tạo', width: 180 },
    { field: 'updatedAt', headerName: 'Ngày cập nhật', width: 180 },
    {
      field: 'action',
      headerName: 'Chức năng',
      width: 320,
      renderCell: (params) => (
        <div className="cellAction">
          {role === 'SUPERADMIN' && (
            <>
              <div className="approveButton" onClick={() => handleApprove(params.row.id)}>
                Duyệt
              </div>
              <div className="rejectButton" onClick={() => handleReject(params.row.id)}>
                Từ chối
              </div>
            </>
          )}
          {role === 'ADMIN' && (
            <>
              <Link to={`/programs/${params.row.id}`} style={{ textDecoration: "none" }}>
                <div className="viewButton" onClick={() => handleViewDetails(params.row.id)}>
                  Chi tiết
                </div>
              </Link>
              <Link to={`/programs/update-program/${params.row.id}`} style={{ textDecoration: "none" }}>
                <div className="updateButton">
                  Cập nhật
                </div>
              </Link>
              <Link to={`/programs/joinprogram/${params.row.id}`} style={{ textDecoration: "none" }}>
                <div className="attendanceButton">
                  Điểm danh
                </div>
              </Link>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Chương trình
        {role === 'ADMIN' && (
          <Link to="/programs/create-program" className="link">
            Thêm mới
          </Link>
        )}
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

      {detailedProgram && (
        <div className="detailedProgram">
          <h3>Thông tin chi tiết chương trình</h3>
          <p><strong>ID:</strong> {detailedProgram._id}</p>
          <p><strong>Tên chương trình:</strong> {detailedProgram.programName}</p>
          <p><strong>Mô tả:</strong> {detailedProgram.description}</p>
          <p><strong>Số lượng:</strong> {detailedProgram.quantity}</p>
          <p><strong>Trạng thái:</strong> {detailedProgram.status}</p>
          <p><strong>Ảnh mô tả:</strong> <img src={detailedProgram.image} alt="Program" style={{ width: 100, height: 100 }} /></p>
          <p><strong>Ngày tham gia:</strong> {new Date(detailedProgram.startDate).toLocaleString()}</p>
          <p><strong>Ngày mở đăng ký:</strong> {new Date(detailedProgram.registerDate).toLocaleString()}</p>
          <p><strong>Điểm:</strong> {detailedProgram.point}</p>
          <p><strong>Ngày tạo:</strong> {new Date(detailedProgram.createdAt).toLocaleString()}</p>
          <p><strong>Ngày cập nhật:</strong> {new Date(detailedProgram.updatedAt).toLocaleString()}</p>
          {/* Display other details as needed */}
        </div>
      )}
    </div>
  );
};

export default DataProgram;
