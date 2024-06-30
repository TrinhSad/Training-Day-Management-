import "./updateuser.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../configs/app.config";
import { useParams, useNavigate } from "react-router-dom";

const UpdateUser = ({ title }) => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const initialFormData = {
    MSSV: "",
    fullName: "",
    point: "", // Set initial point as 0
    birthDay: "",
    gender: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(`${BASE_URL}/system/get-user-by-id?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userData = response.data.user;
        setFormData({
          MSSV: userData.MSSV,
          fullName: userData.fullName,
          point: userData.point,
          birthDay: new Date(userData.birthDay).toISOString().split('T')[0],
          gender: userData.gender,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details");
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      const { MSSV, fullName, point, birthDay, gender } = formData;

      const response = await axios.put(`${BASE_URL}/system/update-user?userId=${userId}`, {
        MSSV,
        fullName,
        point,
        birthDay,
        gender,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("User updated successfully:", response.data);

      navigate("/users"); // Redirect to users page upon successful update
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Failed to update user");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>MSSV</label>
                <input
                  type="text"
                  name="MSSV"
                  placeholder="Enter MSSV"
                  value={formData.MSSV}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Điểm</label>
                <input
                  type="number"
                  name="point"
                  placeholder="Enter Point"
                  value={formData.point}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Giới tính</label>
                <input
                  type="text"
                  name="gender"
                  placeholder="Enter Gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                />
              </div>

              {error && <div className="error">{error}</div>}

              <button type="submit">Cập nhật</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
