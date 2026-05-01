import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Student name is required"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    seatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: [true, "Seat assignment is required"]
    },
    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "Slot assignment is required"]
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    profileImage: {
        type: String,   // Cloudinary URL
        default: null
    }
}, { timestamps: true });

studentSchema.index({ status: 1 });
studentSchema.index({ seatId: 1 });
studentSchema.index({ slotId: 1 });

export const Student = mongoose.model("Student", studentSchema);
