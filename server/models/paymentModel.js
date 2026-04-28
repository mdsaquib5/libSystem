import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    months: {
        type: Number,
        required: true,
        min: 1
    },
    monthlyCharge: {
        type: Number,
        required: true,
        default: 1500
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["paid", "pending", "overdue"],
        default: "paid"
    },
    paidAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const Payment = mongoose.model("Payment", paymentSchema);
