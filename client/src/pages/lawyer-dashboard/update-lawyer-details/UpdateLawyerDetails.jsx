import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UpdateLawyerDetails.css";

const UpdateLawyerDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    phoneNumber: "",
    address: "",
    experience: "",
    fees: "",
    picturePath: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/lawyer/getLawyer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(response.data.data);
        setAvatar(response.data.data.picturePath || null);
        setError("");
      } catch (err) {
        console.error("Error fetching lawyer details:", err);
        setError(err.response?.data?.message || "Failed to fetch lawyer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post("http://localhost:5000/lawyer/uploadProfilePicture", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setAvatar(response.data.picturePath);
        setFormData({
          ...formData,
          picturePath: response.data.picturePath,
        });
        setSuccess("Profile picture updated successfully!");
      } catch (err) {
        console.error("Error uploading profile picture:", err);
        setError(err.response?.data?.message || "Failed to upload profile picture.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/lawyer/updateLawyer",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Details updated successfully!");
    } catch (err) {
      console.error("Error updating details:", err);
      setError(err.response?.data?.message || "Failed to update details.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your details...</p>
      </div>
    );
  }

  return (
    <div className="update-lawyer-details">
      <div className="page-header">
        <h1>Update Your Details</h1>
        <button className="back-btn" onClick={() => navigate("/lawyer-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit} className="update-form">
        <div className="avatar-upload-container">
          <div
            className="avatar-upload"
            onClick={handleAvatarClick}
            style={{ backgroundImage: avatar ? `url(${avatar})` : "none" }}
          >
            {!avatar && (
              <div className="avatar-placeholder">
                <i className="avatar-icon">👤</i>
                <span>Add Photo</span>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
          </div>
          <p className="avatar-help-text">Click to upload your professional photo</p>
        </div>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="fees">Consultation Fees</label>
          <input
            type="number"
            id="fees"
            name="fees"
            value={formData.fees}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Update Details
        </button>
      </form>
    </div>
  );
};

export default UpdateLawyerDetails;
