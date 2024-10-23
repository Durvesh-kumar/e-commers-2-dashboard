import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        require: true
    },
    clerkId: {
        type: String,
        require: true
    },
    message: {
        type: String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    rating: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.models.Review || mongoose.model("Review", reviewsSchema);

export default Review;