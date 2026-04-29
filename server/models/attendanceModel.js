import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true
    },
    status: {
        type: String,
        enum: ["present", "absent"],
        required: true
    },
    isManual: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure one record per student per day
attendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });
// Fast lookup by date alone
attendanceSchema.index({ date: 1 });

export const Attendance = mongoose.model("Attendance", attendanceSchema);
