import Razorpay from "razorpay";
import crypto from "crypto";
// import { validateToken } from "../../middlewares/authMiddleware.js"; // Import validateToken

const razorpay = new Razorpay({
  key_id: "your_razorpay_key", // Replace with your Razorpay key
  key_secret: "your_razorpay_secret", // Replace with your Razorpay secret
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const options = {
      amount,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "your_razorpay_secret") // Replace with your Razorpay secret
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Failed to verify payment" });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { mode, amount, appointmentDetails } = req.body;
    console.log("Mode : " + mode)
    console.log("amount : " + amount)
    console.log("appointmentDetails : " + appointmentDetails)


    if (!mode || !amount || !appointmentDetails) {
      return res.status(400).json({ success: false, message: "Payment mode, amount, and appointment details are required" });
    }

    // Simulate successful payment
    console.log(`Payment of ₹${amount} processed successfully via ${mode}`);
    console.log("Appointment Details:", appointmentDetails);

    return res.status(200).json({ success: true, message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ success: false, message: "Failed to process payment" });
  }
};
