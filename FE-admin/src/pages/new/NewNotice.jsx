import "./newnotice.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../configs/app.config";

const CreateNotification = () => {
  const initialFormData = {
    title: "",
    message: "",
    attach: null, // Change to null for better handling of files
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null); // Use null instead of empty string
  const [error, setError] = useState("");
  const navigate = useNavigate(); // useNavigate hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "attach") {
      // Handle image file selection
      setFormData({ ...formData, attach: e.target.files[0] });
      setFile(e.target.files[0]); // Set file state for preview
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      // Prepare form data to send
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await axios.post(
        `${BASE_URL}/notification/send-notification`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Important to set this for file uploads
          },
        }
      );
      setFormData(initialFormData); // Clear form data after successful creation
      setFile(null); // Clear the file input
      navigate("/notice"); // Navigate to the notice page after success
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("Failed to send notification");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Gửi thông báo</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form onSubmit={handleSubmit}>
              <div className="formInput">
                <label>Tiêu đề</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Lời nhắn</label>
                <input
                  type="text"
                  name="message"
                  placeholder="Enter Message"
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <img
                  className="img"
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="Selected file preview"
                />
                <label htmlFor="attach">
                  Đính kèm: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="attach"
                  name="attach"
                  onChange={handleInputChange}
                  style={{ display: "none" }}
                />
              </div>
              <div className="btnRegister">
                <button type="submit">Gửi</button>
              </div>

              {/* {error && <div className="error">{error}</div>}

              <button type="submit">Send Notification</button> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNotification;
