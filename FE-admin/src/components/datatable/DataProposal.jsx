import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../configs/app.config"; // Assuming BASE_URL is correctly defined
import "./dataproposal.scss";

const DataPropose = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedPropose, setSelectedPropose] = useState(null); // State for detailed propose info
  const [reload, setReload] = useState(false); // State to trigger reload

  useEffect(() => {
    fetchProposes();
  }, [reload]); // Reload whenever 'reload' changes

  const fetchProposes = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.get(`${BASE_URL}/propose/get-all-proposes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const proposes = response.data.proposes.map((propose) => ({
        id: propose._id,
        content: propose.content,
        status: propose.status,
        type: propose.type,
        images: propose.images,
        mssv: propose.MSSV, // Include MSSV
        createdAt: new Date(propose.createdAt).toLocaleString(),
        updatedAt: new Date(propose.updatedAt).toLocaleString(),
      }));

      setData(proposes);
    } catch (error) {
      console.error("Error fetching proposes:", error);
      setError("Failed to fetch proposes");
    }
  };

  // const handleViewDetails = async (id) => {
  //   try {
  //     const token = sessionStorage.getItem("accessToken");
  //     if (!token) {
  //       throw new Error("No access token found");
  //     }

  //     const response = await axios.get(`${BASE_URL}/propose/get-propose/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     setSelectedPropose(response.data.propose);
  //   } catch (error) {
  //     console.error("Error fetching propose details:", error);
  //     // Handle error or show error message
  //   }
  // };

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/propose/approve-propose/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status in the local data state after approval
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, status: "APPROVED" } : item
      );
      setData(updatedData);

      console.log("Propose approved successfully:", response.data);
      setReload(true); // Trigger reload
    } catch (error) {
      console.error("Error approving propose:", error);
      // Handle error or show error message
    }
  };

  const handleReject = async (id) => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.put(
        `${BASE_URL}/propose/reject-propose/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update status in the local data state after rejection
      const updatedData = data.map((item) =>
        item.id === id ? { ...item, status: "REJECTED" } : item
      );
      setData(updatedData);

      console.log("Propose rejected successfully:", response.data);
      setReload(true); // Trigger reload
    } catch (error) {
      console.error("Error rejecting propose:", error);
      // Handle error or show error message
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "mssv", headerName: "MSSV", width: 120 },
    { field: "content", headerName: "Nội dung", width: 300 },
    { field: "type", headerName: "Thể loại", width: 100 },
    {
      field: "images",
      headerName: "Ảnh đính kèm",
      width: 120,
      renderCell: (params) => (
        <div>
          {params.row.images.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`img-${index}`}
              style={{ width: 50, height: 50, marginRight: 5 }}
            />
          ))}
        </div>
      ),
    },
    { field: "status", headerName: "Trạng thái", width: 120 },
    { field: "createdAt", headerName: "Ngày tạo", width: 180 },
    { field: "updatedAt", headerName: "Ngày cập nhật", width: 180 },
    {
      field: "action",
      headerName: "Chức năng",
      width: 220,
      renderCell: (params) => (
        <div className="cellAction">
          {/* <div className="viewButton" onClick={() => handleViewDetails(params.row.id)}>
            View
          </div> */}
          <div className="approveButton" onClick={() => handleApprove(params.row.id)}>
            Duyệt
          </div>
          <div className="rejectButton" onClick={() => handleReject(params.row.id)}>
            Từ chối
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Đề xuất sinh viên
        {/* <Link to="/proposes/create-propose" className="link">
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

      {selectedPropose && (
        <div className="detailedPropose">
          <h3>Detailed Propose Information</h3>
          <p><strong>ID:</strong> {selectedPropose._id}</p>
          <p><strong>Content:</strong> {selectedPropose.content}</p>
          <p><strong>Type:</strong> {selectedPropose.type}</p>
          <p><strong>MSSV:</strong> {selectedPropose.MSSV}</p> {/* Display MSSV */}
          <p><strong>Images:</strong></p>
          <div>
            {selectedPropose.images.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`img-${index}`}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
            ))}
          </div>
          {/* Display other details as needed */}
        </div>
      )}
    </div>
  );
};

export default DataPropose;
