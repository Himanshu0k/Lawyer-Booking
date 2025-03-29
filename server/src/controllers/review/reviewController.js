import Review from "../../models/review.js";
// import Review from "../../models/review.js";

// ...existing code...

// Controller to get reviews by lawyerId
export const getReviewsByLawyerId = async (req, res) => {
    const { lawyerId } = req.params;

    try {
        const reviews = await Review.find({ lawyerId }).populate("userId", "name");
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching reviews", error });
    }
};

// ...existing code...
