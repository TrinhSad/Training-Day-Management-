import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Link } from "react-router-dom";
import {  useEffect, useState } from "react";
// import { DarkModeContext } from "../../context/darkModeContext";

const Sidebar = () => {
  // const { dispatch } = useContext(DarkModeContext);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const userRole = sessionStorage.getItem('role');
    setRole(userRole);
  }, []);

  const handleLogout = () => {
    // Xóa token khỏi sessionStorage khi đăng xuất
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("role");
    // Có thể thực hiện các bước khác khi đăng xuất, ví dụ: chuyển hướng người dùng đến trang đăng nhập
  };

  return (
    <div className="sidebar">
      <div className="top">
        <span className="logo"><img src="https://media.vaa.edu.vn/Media/2_SVVAA/Images/csv-vaa00e11812-e-e.png" alt="" /></span>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">Trang chủ</p>
          <li>
            <DashboardIcon className="icon" />
            <Link to="/home" style={{ textDecoration: "none" }}>
              <span>Trang chủ</span>
            </Link>
          </li>

          {role === 'SUPERADMIN' && (
            <>
              <p className="title">Quản lý sinh viên</p>
              <Link to="/users" style={{ textDecoration: "none" }}>
                <li>
                  <PersonOutlineIcon className="icon" />
                  <span>Sinh viên</span>
                </li>
              </Link>
              <Link to="/proposals" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsSystemDaydreamOutlinedIcon className="icon" />
                  <span>Đề xuất sinh viên</span>
                </li>
              </Link>
              <p className="title">Quản lý chương trình</p>
              <Link to="/programs" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Chương trình</span>
                </li>
              </Link>
            </>
          )}

          {(role === 'ADMIN') && (
            <>
              <p className="title">Quản lý chương trình</p>
              <Link to="/programs" style={{ textDecoration: "none" }}>
                <li>
                  <StoreIcon className="icon" />
                  <span>Chương trình</span>
                </li>
              </Link>
              <p className="title">Thông báo và điểm danh</p>
              <Link to="/notice" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsSystemDaydreamOutlinedIcon className="icon" />
                  <span>Thông báo</span>
                </li>
              </Link>
              <Link to="/attendances" style={{ textDecoration: "none" }}>
                <li>
                  <SettingsSystemDaydreamOutlinedIcon className="icon" />
                  <span>Điểm danh</span>
                </li>
              </Link>
            </>
          )}

          <p className="title">Quản lý tài khoản</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span><b>{role}</b></span>
          </li>
          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <ExitToAppIcon className="icon" />
            <Link to="/" style={{ textDecoration: "none" }}>
              <span>Đăng xuất</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
