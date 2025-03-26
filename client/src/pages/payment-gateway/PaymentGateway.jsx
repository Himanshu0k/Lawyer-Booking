import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentGateway.css";
import { FaCreditCard, FaUniversity, FaGoogleWallet, FaMoneyCheckAlt } from "react-icons/fa";

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentData, fees } = location.state || {};
  const [paymentMode, setPaymentMode] = useState("");
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!appointmentData || !fees) {
      navigate("/book-appointment"); // Redirect if no appointment data is provided
    }
  }, [appointmentData, fees, navigate]);

  const handleModeChange = (mode) => {
    setPaymentMode(mode);
    setFormData({});
    setError("");
    setSuccess("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
    setSuccess("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const paymentData = {
        ...formData,
        mode: paymentMode,
        amount: fees,
        appointmentDetails: appointmentData,
      };

      const response = await axios.post("http://localhost:5000/payment/processPayment", paymentData);

      if (response.data.success) {
        // Save the appointment details after successful payment
        const saveAppointmentResponse = await axios.post(
          "http://localhost:5000/user/appointment/bookAppointment",
          appointmentData
        );

        if (saveAppointmentResponse.data.success) {
          setSuccess("Payment successful! Your appointment is confirmed.");
          setTimeout(() => navigate("/user-dashboard"), 3000);
        } else {
          throw new Error(saveAppointmentResponse.data.message || "Failed to save appointment.");
        }
      } else {
        throw new Error(response.data.message || "Payment failed");
      }
    } catch (err) {
      console.error("Error during payment:", err);
      setError(err.response?.data?.message || "Failed to process payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMode) {
      case "creditCard":
        return (
          <>
            <div className="form-group">
              <label htmlFor="cardHolderName">Card Holder Name</label>
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                value={formData.cardHolderName || ""}
                onChange={handleInputChange}
                placeholder="Enter card holder name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber || ""}
                onChange={handleInputChange}
                placeholder="Enter card number"
                maxLength="16"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate || ""}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv || ""}
                  onChange={handleInputChange}
                  placeholder="CVV"
                  maxLength="3"
                  required
                />
              </div>
            </div>
          </>
        );
      case "upi":
        return (
          <div className="form-group">
            <label htmlFor="upiId">UPI ID</label>
            <input
              type="text"
              id="upiId"
              name="upiId"
              value={formData.upiId || ""}
              onChange={handleInputChange}
              placeholder="Enter your UPI ID"
              required
            />
          </div>
        );
      case "netBanking":
        return (
          <div className="form-group">
            <label htmlFor="bankName">Bank Name</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName || ""}
              onChange={handleInputChange}
              placeholder="Enter your bank name"
              required
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payment-gateway">
      <h1>Payment Gateway</h1>
      <p>Consultation Fees: ₹{fees}</p>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <div className="payment-modes">
        <div
          className={`payment-mode ${paymentMode === "creditCard" ? "selected" : ""}`}
          onClick={() => handleModeChange("creditCard")}
        >
          <FaCreditCard className="payment-icon" />
          <span>Credit Card</span>
        </div>
        <div
          className={`payment-mode ${paymentMode === "debitCard" ? "selected" : ""}`}
          onClick={() => handleModeChange("debitCard")}
        >
          <FaMoneyCheckAlt className="payment-icon" />
          <span>Debit Card</span>
        </div>
        <div
          className={`payment-mode ${paymentMode === "upi" ? "selected" : ""}`}
          onClick={() => handleModeChange("upi")}
        >
          <FaGoogleWallet className="payment-icon" />
          <span>UPI</span>
        </div>
        <div
          className={`payment-mode ${paymentMode === "netBanking" ? "selected" : ""}`}
          onClick={() => handleModeChange("netBanking")}
        >
          <FaUniversity className="payment-icon" />
          <span>Net Banking</span>
        </div>
      </div>
      <form onSubmit={handlePayment} className="payment-form">
        {renderPaymentFields()}
        <button type="submit" className="pay-btn" disabled={loading || !paymentMode}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default PaymentGateway;
