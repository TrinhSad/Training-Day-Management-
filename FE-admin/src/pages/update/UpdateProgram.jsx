// updateprogram.jsx

import "./updateprogram.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../configs/app.config";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const UpdateProgram = ({ title }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { programId } = useParams();
  const initialFormData = {
    programName: "",
    description: "",
    quantity: "",
    startDate: "",
    registerDate: "",
    point: "",
    minusPoint: false,
    isPropose: false,
    categoryId: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(`${BASE_URL}/category/get-categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(`${BASE_URL}/program/get-program/${programId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const programData = response.data.program;
        setFormData({
          programName: programData.programName,
          description: programData.description,
          quantity: programData.quantity,
          startDate: programData.startDate.split("T")[0],
          registerDate: programData.registerDate.split("T")[0],
          point: programData.point.toString(),
          minusPoint: programData.minusPoint,
          isPropose: programData.isPropose,
          categoryId: programData.categoryId,
          image: programData.image || null,
        });
      } catch (error) {
        console.error("Error fetching program details:", error);
        setError("Failed to fetch program details");
      }
    };

    if (programId) {
      fetchProgramDetails();
    }
  }, [programId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Create a new object to hold updated form data
    const updatedData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    // Handle file input separately
    if (type === "file") {
      updatedData.image = files[0];
      setFile(files[0]);
    }

    // Update formData state with the new object
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No access token found");
      }

      // Prepare data object with only changed fields
      const data = {
        programName: formData.programName,
        description: formData.description,
        quantity: formData.quantity,
        startDate: formData.startDate,
        registerDate: formData.registerDate,
        point: formData.point,
        minusPoint: formData.minusPoint,
        isPropose: formData.isPropose,
        categoryId: formData.categoryId,
      };

      let formDataToSend = new FormData();

      // Handle file separately if it's selected
      if (file) {
        formDataToSend.append("image", file);
        formDataToSend.append("data", JSON.stringify(data));
      } else {
        formDataToSend = data;
      }

      const response = await axios.put(
        `${BASE_URL}/program/update-program/${programId}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": file ? "multipart/form-data" : "application/json",
          },
        }
      );

      console.log("Program updated successfully:", response.data);

      // Update formData with response data
      const updatedProgram = response.data.program;
      setFormData({
        programName: updatedProgram.programName,
        description: updatedProgram.description,
        quantity: updatedProgram.quantity,
        startDate: updatedProgram.startDate.split("T")[0],
        registerDate: updatedProgram.registerDate.split("T")[0],
        point: updatedProgram.point.toString(),
        minusPoint: updatedProgram.minusPoint,
        isPropose: updatedProgram.isPropose,
        categoryId: updatedProgram.categoryId,
        image: updatedProgram.image || null,
      });

      setFile(null);
      setError(""); // Clear any previous errors

      // Redirect to programs page upon successful update
      navigate("/programs");
    } catch (error) {
      console.error("Error updating program:", error);
      setError("Failed to update program");
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
                <label>Tên chương trình</label>
                <input
                  type="text"
                  name="programName"
                  placeholder="Enter Program Name"
                  value={formData.programName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Mô tả</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Enter Description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Ngày đăng kí</label>
                <input
                  type="date"
                  name="registerDate"
                  value={formData.registerDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Ngày bắt đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="formInput">
                <label>Số lượng</label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Enter Quantity"
                  value={formData.quantity}
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

              <div className="formInput boolean">
                <label>
                  Điểm trừ
                  <input
                    type="checkbox"
                    name="minusPoint"
                    checked={formData.minusPoint}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="formInput boolean">
                <label>
                  Minh chứng
                  <input
                    type="checkbox"
                    name="isPropose"
                    checked={formData.isPropose}
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="formInput">
                <label htmlFor="categoryId">Phương thức</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn phương thức</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formInput">
                <img
                  className="img"
                  src={
                    file
                      ? URL.createObjectURL(file)
                      : formData.image ||
                        "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                  }
                  alt="Selected file preview"
                />
                <label htmlFor="image">
                  Ảnh: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleInputChange}
                  style={{ display: "none" }}
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

export default UpdateProgram;
    