import "./datauser.scss"; // Import CSS/SCSS file
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid component from MUI
import { Link } from "react-router-dom"; // Import Link component from React Router
import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import axios from "axios"; // Import axios for HTTP requests
import { BASE_URL } from "../../configs/app.config"; // Import BASE_URL from config file

const userColumns = [
  { field: "_id", headerName: "ID", width: 150 },
  { field: "MSSV", headerName: "MSSV", width: 150 },
  { field: "fullName", headerName: "Họ và tên", width: 200 },
  { field: "point", headerName: "Tổng điểm", width: 150, align: 'center' },
  { field: "birthDay", headerName: "Ngày sinh", width: 150 },
  { field: "gender", headerName: "Giới tính", width: 150 },
  { field: "facultyId", headerName: "Faculty ID", width: 150 },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    width: 200,
    type: "date",
  },
];

const DataUser = () => {
  const [userRows, setUserRows] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State to manage error message

  const role = sessionStorage.getItem('role'); // Get role from sessionStorage

  useEffect(() => {
    const fetchUsers = async () => {
      if (role !== 'SUPERADMIN') {
        setLoading(false); // Set loading to false if user is not SUPERADMIN
        return;
      }
      
      try {
        const token = sessionStorage.getItem('accessToken');
        const response = await axios.get(`${BASE_URL}/system/get-all-user`, {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from sessionStorage
            'Cache-Control': 'no-cache', // Add cache control header
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
        console.log('Users:', response.data.users); // Log user data to console
        setUserRows(response.data.users); 
      } catch (error) {
        console.error('Error fetching user data:', error); // Log error if fetch fails
        setError('Error fetching user data');
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUsers(); // Call fetchUsers function on component mount
  }, [role]); // Add role as dependency to re-run effect if role changes

  if (loading) {
    return <div>Loading...</div>; // Render loading indicator while fetching data
  }

  if (error) {
    return <div>{error}</div>; // Render error message if fetch fails
  }

  if (role !== 'SUPERADMIN') {
    return <div>...</div>; // Render message if user is not SUPERADMIN
  }

  const handleDelete = async (userId) => {
    try {
      const token = sessionStorage.getItem('accessToken');
      await axios.delete(`${BASE_URL}/system/delete-user`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from sessionStorage
        },
        params: { userId }, // Pass userId as a query parameter
      });
      setUserRows(userRows.filter((row) => row._id !== userId)); // Remove deleted user from state
      console.log(`User with ID ${userId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      setError(`Error deleting user with ID ${userId}`);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Chức năng",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/users/update-user/${params.row._id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Cập nhật</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row._id)}
            >
              Xóa
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Sinh viên
        <Link to="/users/register-user" className="link">
          Đăng ký người dùng
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={userRows}
        columns={userColumns.concat(actionColumn)}
        pageSize={10} // Increase pageSize if needed
        rowsPerPageOptions={[10, 20, 50]} // Add more options as needed
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default DataUser;
