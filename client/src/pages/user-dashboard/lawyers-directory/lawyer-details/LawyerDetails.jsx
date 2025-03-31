import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LawyerDetails.css';
import axios from 'axios';

const LawyerDetails = () => {
    const { lawyerId } = useParams(); 
    const navigate = useNavigate();
    const [lawyer, setLawyer] = useState(null);
    const [reviews, setReviews] = useState([]); 
    const [userNames, setUserNames] = useState({}); 

    useEffect(() => {
        if (!lawyerId) {
            console.error("Error: Lawyer ID is undefined");
            return;
        }

        // Fetch lawyer details
        fetch(`http://localhost:5000/lawyer/getLawyerById/${lawyerId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const { role, picturePath, ...lawyerData } = data.data;
                    setLawyer(lawyerData);
                } else {
                    console.error("Error:", data.message);
                }
            })
            .catch(error => console.error('Error fetching lawyer details:', error));

        // Fetch reviews for the lawyer
        fetch(`http://localhost:5000/review/getReviewsByLawyerId/${lawyerId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setReviews(data.reviews);
                } else {
                    console.error("Error:", data.message);
                }
            })
            .catch(error => console.error('Error fetching reviews:', error));

    }, [lawyerId]);
    
    const renderStars = (rating) => {
         const star = rating.split(" ")
         let totalStar = ""
         for(let i = 0; i < star[0]; i++) {
            totalStar += "⭐";
         }
        return <span>{totalStar}</span>;
    };

    if (!lawyer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="lawyer-details">
            <div className="header">
                <h1>{lawyer.name}</h1>
                <button 
                    className="back-button" 
                    onClick={() => navigate('/lawyers-directory')}
                >
                    Back to Find Lawyer
                </button>
            </div>

            <div className="details">
                <p><strong>Date of Birth:</strong> {new Date(lawyer.dob).toLocaleDateString()}</p>
                <p><strong>Email:</strong> {lawyer.email}</p>
                <p><strong>Phone Number:</strong> {lawyer.phoneNumber}</p>
                <p><strong>Address:</strong> {lawyer.address}</p>
                <p><strong>Specialization:</strong> {lawyer.specialization}</p>
                <p><strong>Experience:</strong> {lawyer.experience} years</p>
                <p><strong>Fees:</strong> ₹{lawyer.fees}</p>
            </div>

            <div className="reviews-section">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review._id} className="review">
                            <p><strong>Posted by:</strong> {review.userName || "Anonymous"}</p>
                            <p><strong>Rating:</strong> {renderStars(review.rating)}</p>
                            <p><strong>Comment:</strong> {review.comment}</p>
                            <p><strong>Posted on:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews available for this lawyer.</p>
                )}
            </div>

            <div className="book-appointment">
                <button 
                    className="book-appointment-button" 
                    onClick={() => navigate(`/book-appointment`)}
                >
                    Book Appointment
                </button>
            </div>
        </div>
    );
};

export default LawyerDetails;
