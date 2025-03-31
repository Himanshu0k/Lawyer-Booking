import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ReviewLawyer.css";

const ReviewLawyer = () => {
  const { lawyerId } = useParams(); // Ensure lawyerId is fetched from URL params
  const navigate = useNavigate();
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  // const [userName, setUserName] = useState(""); // State to store the user's name

  // useEffect(() => {
  //   const fetchUserName = async () => {
  //     try {
  //       const userId = sessionStorage.getItem("token");
  //       const token = sessionStorage.getItem("token");
  //       if (userId && token) {
  //         const response = await axios.get(
  //           `http://localhost:5000/user/getUserName/${userId}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${token}`,
  //             },
  //           }
  //         );
  //         setUserName(response.data.name || "Anonymous");
  //       } else {
  //         setUserName("Anonymous");
  //       }
  //     } catch (err) {
  //       console.error("Error fetching user name:", err);
  //       setUserName("Anonymous");
  //     }
  //   };

  //   fetchUserName();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      // const userId = sessionStorage.getItem("token"); // Retrieve user ID from session storage

      // console.log(`Name: ${userName} User: ${userId} Lawyer: ${lawyerId}`);
      const response = await axios.post(
        `http://localhost:5000/user/appointment/addReview`, // Ensure lawyerId is passed in the URL
        { lawyerId, rating, comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Review submitted successfully!");
      setError("");
      setTimeout(() => navigate("/user-dashboard"), 2000);
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.message || "Failed to submit review");
      setSuccess("");
    }
  };

  return (
    <div className="review-lawyer">
      <h1>Rate Your Experience</h1>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="star-rating">
          {[5, 4, 3, 2, 1].map((star) => (
            <React.Fragment key={star}>
              <input
                type="radio"
                id={`star${star}`}
                name="rating"
                value={`${star} star${star > 1 ? "s" : ""}`}
                onChange={(e) => setRating(e.target.value)}
              />
              <label htmlFor={`star${star}`}>★</label>
            </React.Fragment>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewLawyer;
