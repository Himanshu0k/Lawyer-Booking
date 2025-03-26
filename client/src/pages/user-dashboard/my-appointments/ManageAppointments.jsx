import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Import icons
import "./ManageAppointments.css";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User is not logged in");
          return;
        }

        const response = await axios.get("http://localhost:5000/user/appointment/getAppointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAppointments(response.data.data);
        setError("");
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (appointmentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this appointment?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/user/appointment/deleteAppointment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { appointmentId },
      });

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
      alert("Appointment deleted successfully!");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      alert(err.response?.data?.message || "Failed to delete appointment");
    }
  };

  if (loading) {
    return (
      <div className="manage-appointments loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="manage-appointments">
      <div className="page-header">
        <h1>My Appointments</h1>
        <button className="back-btn" onClick={() => navigate("/user-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      {appointments.length === 0 ? (
        <div className="no-appointments">
          <p>You have not booked any appointments yet.</p>
        </div>
      ) : (
        <div className="appointments-list">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-details">
                <h3>{appointment.bookingCause || "Consultation"}</h3>
                <p>
                  <strong>Date:</strong> {formatDate(appointment.date)}
                </p>
                <p>
                  <strong>Time:</strong> {appointment.time}
                </p>
                <p>
                  <strong>Lawyer:</strong> {appointment.lawyerId?.name || "N/A"} {/* Display lawyer's name */}
                </p>
                <p>
                  <strong>Status:</strong> <span className={`status ${appointment.status}`}>{appointment.status}</span>
                </p>
              </div>
              <div className="appointment-actions">
                <button
                  className="icon-btn update-btn"
                  onClick={() => navigate(`/update-appointment/${appointment._id}`)} // Navigate to UpdateAppointment
                  disabled={appointment.status === "approved"}
                  title="Update Appointment"
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDelete(appointment._id)}
                  title="Delete Appointment"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAppointments;