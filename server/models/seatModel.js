import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    startTime: {
        hour: { type: String, required: true },
        minute: { type: String, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true }
    },
    endTime: {
        hour: { type: String, required: true },
        minute: { type: String, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true }
    },
    day: {
        type: String,
        enum: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        required: true
    },
    status: {
        type: String,
        enum: ["available", "occupied"],
        default: "available"
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student", // Assuming a Student model might exist later, or just nullable
        default: null
    }
}, { timestamps: true });

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slots: [slotSchema]
}, { timestamps: true });

export const Seat = mongoose.model("Seat", seatSchema);
