import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookAppointment.css";

const BookAppointment = () => {
  const navigate = useNavigate();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    lawyerId: "",
    date: "",
    time: "",
    bookingCause: "",
  });
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  // Fetch all lawyers
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/lawyer/getAllLawyers");
        setLawyers(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to load lawyers. Please try again later.");
        console.error("Error fetching lawyers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "lawyerId") {
      const lawyer = lawyers.find((l) => l._id === value);
      setSelectedLawyer(lawyer);
    }

    setError("");
    setSuccess("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setError("User is not logged in");
        setIsSubmitting(false);
        return;
      }

      const appointmentData = {
        lawyerId: formData.lawyerId,
        date: formData.date,
        time: formData.time,
        bookingCause: formData.bookingCause,
      };

      // Redirect to payment gateway with appointment details
      navigate("/payment-gateway", { state: { appointmentData, fees: selectedLawyer.fees } });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to proceed to payment.");
      console.error("Error proceeding to payment:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="book-appointment loading-container">
        <div className="loading-spinner"></div>
        <p>Loading lawyers...</p>
      </div>
    );
  }

  return (
    <div className="book-appointment">
      <div className="page-header">
        <h1>Book an Appointment</h1>
        <button className="back-btn" onClick={() => navigate("/user-dashboard")}>
          Back to Dashboard
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="booking-container">
        <div className="booking-form-container">
          <h2>Schedule Your Consultation</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <div className="form-group">
              <label htmlFor="lawyerId">Select a Lawyer</label>
              <select
                id="lawyerId"
                name="lawyerId"
                value={formData.lawyerId}
                onChange={handleInputChange}
                required
                className="lawyer-select"
              >
                <option value="">-- Choose a lawyer --</option>
                {lawyers.map((lawyer) => (
                  <option key={lawyer._id} value={lawyer._id}>
                    {lawyer.name} - {lawyer.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split("T")[0]}
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
              <label htmlFor="bookingCause">Purpose of Consultation</label>
              <textarea
                id="bookingCause"
                name="bookingCause"
                value={formData.bookingCause}
                onChange={handleInputChange}
                placeholder="Provide details about the cause of booking"
                required
              ></textarea>
            </div>

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Booking..." : "Proceed to Payment"}
            </button>
          </form>
        </div>

        {selectedLawyer && (
          <div className="lawyer-preview">
            <h3>Selected Lawyer</h3>
            <div className="lawyer-card selected">
              <div className="lawyer-avatar">{selectedLawyer.name.charAt(0)}</div>
              <div className="lawyer-info">
                <h4>{selectedLawyer.name}</h4>
                <p className="lawyer-specialization">{selectedLawyer.specialization}</p>
                <p className="lawyer-experience">{selectedLawyer.experience} years of experience</p>
                <p className="lawyer-bio">{selectedLawyer.bio}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="booking-info">
        <h3>What to Expect</h3>
        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📝</div>
            <h4>Confirmation</h4>
            <p>You'll receive an email confirmation once your appointment is booked.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">⏱️</div>
            <h4>Approval</h4>
            <p>The lawyer will review and approve your appointment request.</p>
          </div>
          <div className="info-card">
            <div className="info-icon">📞</div>
            <h4>Consultation</h4>
            <p>Prepare your questions and documents for a productive consultation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;