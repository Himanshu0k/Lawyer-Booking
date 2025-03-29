import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LawyerDirectory.css";

const LawyerDirectory = () => {
  const [lawyers, setLawyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    specialization: "",
    area: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/lawyer/getAllLawyers");
        setLawyers(response.data.data);
        setError("");
      } catch (err) {
        console.error("Error fetching lawyers:", err);
        setError("Failed to load lawyers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({
      ...searchQuery,
      [name]: value,
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/lawyer/searchLawyers", {
        params: searchQuery,
      });
      setLawyers(response.data.data);
      setError("");
    } catch (err) {
      console.error("Error searching lawyers:", err);
      setError("Failed to search lawyers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="lawyer-directory loading-container">
        <div className="loading-spinner"></div>
        <p>Loading lawyers...</p>
      </div>
    );
  }

  return (
    <div className="lawyer-directory">
      <div className="page-header">
        <h1>Find Your Lawyer</h1>
        <button className="back-btn" onClick={() => navigate("/user-dashboard")}>
          Back to Dashboard
        </button>
      </div>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={searchQuery.name}
            onChange={handleInputChange}
            placeholder="Search by name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={searchQuery.specialization}
            onChange={handleInputChange}
            placeholder="Search by specialization"
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">Area</label>
          <input
            type="text"
            id="area"
            name="area"
            value={searchQuery.area}
            onChange={handleInputChange}
            placeholder="Search by area"
          />
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <div className="lawyers-list">
        {lawyers.length > 0 ? (
          lawyers.map((lawyer) => (
            <div key={lawyer._id} className="lawyer-card">
              <div className="lawyer-avatar">{lawyer.name.charAt(0)}</div>
              <div className="lawyer-info">
                <h3>{lawyer.name}</h3>
                <p><strong>Specialization:</strong> {lawyer.specialization}</p>
                <p><strong>Area:</strong> {lawyer.address}</p>
                <p><strong>Experience:</strong> {lawyer.experience} years</p>
                <p><strong>Fees:</strong> ₹{lawyer.fees}</p>
                <button className="book-btn" onClick={() => navigate(`/lawyer-details/${lawyer._id}`)}>
                  View Lawyer
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No lawyers found.</p>
        )}
      </div>
    </div>
  );
};

export default LawyerDirectory;
