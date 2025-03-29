import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaUserTie, FaClipboardList, FaSignOutAlt } from "react-icons/fa"; // Import icons
import axios from "axios";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data and appointments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = sessionStorage.getItem("token");
  
        if (!token) {
          setError("User is not logged in");
          console.warn("No token found in sessionStorage"); // Debugging log
          return;
        }
  
        console.log("Token being sent:", token); // Debugging log
  
        // Fetch user data with Authorization header
        const userResponse = await axios.get("http://localhost:5000/user/getUser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(userResponse.data.data);
  
        // Fetch appointments with Authorization header
        const appointmentsResponse = await axios.get("http://localhost:5000/user/appointment/getAppointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAppointments(appointmentsResponse.data.data);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getClosestAppointment = () => {
    const now = new Date();
    const upcomingAppointments = appointments.filter(
      (appointment) => new Date(`${appointment.date}T${appointment.time}`) > now
    );
    if (upcomingAppointments.length === 0) return null;

    return upcomingAppointments.reduce((closest, current) => {
      const closestDate = new Date(`${closest.date}T${closest.time}`);
      const currentDate = new Date(`${current.date}T${current.time}`);
      return currentDate < closestDate ? current : closest;
    });
  };

  const refreshAppointments = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const appointmentsResponse = await axios.get("http://localhost:5000/user/appointment/getAppointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(appointmentsResponse.data.data);
    } catch (err) {
      console.error("Error refreshing appointments:", err);
      setError(err.response?.data?.message || "Failed to refresh appointments");
    }
  };

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "appointmentUpdated") {
        refreshAppointments();
        sessionStorage.removeItem("appointmentUpdated"); // Clear the flag after refreshing
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    alert("You have been logged out successfully.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="user-dashboard loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  const closestAppointment = getClosestAppointment();

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="user-welcome">
          <h1>Welcome, {userData?.name || "User"}</h1>
          <p>Manage your legal consultations and appointments</p>
        </div>
        <div className="user-profile">
          <div className="profile-image">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-info">
            {/* <span>{userData?.email || "user@example.com"}</span> */}
            <button className="logout-button" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="user-info">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Date of Birth:</strong> {userData.dob}</p>
        <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
        <p><strong>Address:</strong> {userData.address}</p>
      </div>

      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <div className="action-card" onClick={() => navigate("/book-appointment")}>
            <FaCalendarAlt className="action-icon" />
            <h3>Book Appointment</h3>
            <p>Schedule a consultation with a lawyer</p>
          </div>
          <div className="action-card" onClick={() => navigate("/lawyers-directory")}>
            <FaUserTie className="action-icon" />
            <h3>Find Lawyers</h3>
            <p>Browse and connect with legal professionals</p>
          </div>
          <div className="action-card" onClick={() => navigate("/manage-appointments")}>
            <FaClipboardList className="action-icon" />
            <h3>My Appointments</h3>
            <p>View and manage your scheduled appointments</p>
          </div>
        </div>
      </section>

      <section className="upcoming-appointments">
        <div className="section-header">
          <h2>Upcoming Appointments</h2>
          <Link to="/manage-appointments" className="view-all">
            View All
          </Link>
        </div>

        <div className="appointments-container">
          {closestAppointment ? (
            <div className="appointment-card">
              <div className="appointment-details">
                <h4>{closestAppointment.bookingCause || "Legal Consultation"}</h4>
                <p className="appointment-date">
                  <i className="calendar-icon">📅</i> {formatDate(closestAppointment.date)} at {closestAppointment.time}
                </p>
                <p className="lawyer-name">
                  <i className="lawyer-icon">👨‍⚖️</i> {closestAppointment.lawyerId?.name || "N/A"}
                </p>
                <p className="appointment-status">
                  <strong>Status:</strong> {closestAppointment.status || "Pending"}
                </p>
              </div>
            </div>
          ) : (
            <div className="no-appointments">
              <p>You don't have any upcoming appointments.</p>
              <button 
                className="book-now-btn"
                onClick={() => navigate("/book-appointment")}
              >
                Book Your First Appointment
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="quick-resources">
        <h2>Legal Resources</h2>
        <div className="resources-grid">
          <div className="resource-card">
            <h4>Legal FAQ</h4>
            <p>Common legal questions and answers</p>
            <Link to="/resources/faq">Learn More</Link>
          </div>
          <div className="resource-card">
            <h4>Document Templates</h4>
            <p>Access common legal document templates</p>
            <Link to="/resources/templates">View Templates</Link>
          </div>
          <div className="resource-card">
            <h4>Legal News</h4>
            <p>Stay updated with the latest legal developments</p>
            <Link to="/resources/news">Read News</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;