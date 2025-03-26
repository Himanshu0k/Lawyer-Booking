import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaClock, FaCheckCircle, FaCalendarAlt } from "react-icons/fa"; // Import icons
import "./LawyerDashboard.css";

const LawyerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lawyer, setLawyer] = useState({
    name: "",
    email: "",
    dob: "",
    phoneNumber: "",
    address: "",
    specialization: "",
    experience: "",
    fees: "",
    picturePath: "",
  });

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("lawyerToken");

        if (!token) {
          console.error("Authorization token is missing"); // Debugging log
          throw new Error("Authorization token is missing");
        }

        const response = await axios.get("http://localhost:5000/lawyer/getLawyer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200 && response.data.success) {
          console.log("Lawyer details fetched successfully:", response.data.data); // Debugging log
          setLawyer(response.data.data);
          setError(null);
        } else {
          console.error("Unexpected response:", response); // Debugging log
          setError("Failed to fetch lawyer details.");
        }
      } catch (err) {
        console.error("Error fetching lawyer details:", err);
        setError(err.response?.data?.message || "Failed to fetch lawyer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyerDetails();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="lawyer-dashboard">
      <header className="dashboard-header">
        <div className="lawyer-welcome">
          <h1>Welcome, {lawyer.name || "Lawyer"}</h1>
          <p>Manage your legal consultations and appointments</p>
        </div>
        <div className="lawyer-profile">
          <div className="profile-image">
            {lawyer.picturePath ? (
              <img src={lawyer.picturePath} alt="Profile" />
            ) : (
              lawyer.name.charAt(0).toUpperCase()
            )}
          </div>
          {/* <div className="profile-info">
            <span><strong>Email:</strong> {lawyer.email}</span>
            <span><strong>Phone:</strong> {lawyer.phoneNumber}</span>
            <span><strong>Date of Birth:</strong> {new Date(lawyer.dob).toLocaleDateString()}</span>
            <span><strong>Address:</strong> {lawyer.address}</span>
            <span><strong>Specialization:</strong> {lawyer.specialization}</span>
            <span><strong>Experience:</strong> {lawyer.experience} years</span>
            <span><strong>Consultation Fees:</strong> ₹{lawyer.fees}</span>
          </div> */}
        </div>
      </header>

      <section className="appointments-overview">
        <div className="appointments-sections">
          <div
            className="appointments-section pending-appointments"
            onClick={() => navigate("/pending-appointments")}
          >
            <FaClock className="section-icon" />
            <h2>Pending Appointments</h2>
            <p>View and manage all pending appointments.</p>
          </div>

          <div
            className="appointments-section approved-appointments"
            onClick={() => navigate("/approved-appointments")}
          >
            <FaCheckCircle className="section-icon" />
            <h2>Approved Appointments</h2>
            <p>View and manage all approved appointments.</p>
          </div>
        </div>
      </section>

      <section className="all-appointments-section">
        <div
          className="appointments-section all-appointments"
          onClick={() => navigate("/all-appointments")}
        >
          <FaCalendarAlt className="section-icon" />
          <h2>All Appointments</h2>
          <p>View and manage all appointments in one place.</p>
        </div>
      </section>
    </div>
  );
};

export default LawyerDashboard;