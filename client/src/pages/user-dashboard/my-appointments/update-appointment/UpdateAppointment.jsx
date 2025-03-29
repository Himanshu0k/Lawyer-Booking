import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UpdateAppointment.css";

const UpdateAppointment = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams(); // Extract appointment ID from URL
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    bookingCause: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/user/appointment/getAppointment/${appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { date, time, bookingCause } = response.data.data;
        setFormData({ date, time, bookingCause });
        setError("");
      } catch (err) {
        console.error("Error fetching appointment:", err);
        setError(err.response?.data?.message || "Failed to fetch appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId]);

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
      const token = sessionStorage.getItem("token");
      await axios.patch(
        "http://localhost:5000/user/appointment/updateAppointment",
        {
          appointmentId, // Ensure appointmentId is sent
          date: formData.date,
          time: formData.time,
          bookingCause: formData.bookingCause,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Appointment updated successfully!");
      navigate("/manage-appointments");
    } catch (err) {
      console.error("Error updating appointment:", err);
      setError(err.response?.data?.message || "Failed to update appointment");
    }
  };

  if (loading) {
    return (
      <div className="update-appointment loading-container">
        <div className="loading-spinner"></div>
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="update-appointment">
      <div className="page-header">
        <h1>Update Appointment</h1>
        <button className="back-btn" onClick={() => navigate("/manage-appointments")}>
          Back to Appointments
        </button>
      </div>
      <form onSubmit={handleSubmit} className="update-form">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bookingCause">Booking Cause</label>
          <textarea
            id="bookingCause"
            name="bookingCause"
            value={formData.bookingCause}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          Update Appointment
        </button>
      </form>
    </div>
  );
};

export default UpdateAppointment;