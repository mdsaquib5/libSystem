import { Student } from "../models/studentModel.js";
import cloudinary from "../configs/cloudinary.js";
import { createPayment } from "./paymentService.js";
import { checkOverlap } from "../utils/dateUtils.js";

const uploadToCloudinary = (buffer, folder = "library/students") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};

export const admitStudent = async (studentData, imageBuffer) => {
    const { seatId, slotId, startDate, endDate, monthlyCharge = 1500 } = studentData;

    // Server-side date validation
    if (!startDate || !endDate) {
        throw new Error("Start date and end date are required.");
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format provided.");
    }

    if (start > end) {
        throw new Error("Start date cannot be after end date.");
    }

    // Check overlap
    const existingBookings = await Student.find({
        seatId,
        slotId,
        status: "active"
    });

    const hasOverlap = existingBookings.some(booking => 
        checkOverlap(booking.startDate, booking.endDate, start, end)
    );

    if (hasOverlap) {
        throw new Error("This seat and slot is already booked for the selected date range.");
    }

    let profileImageUrl = null;
    if (imageBuffer) {
        profileImageUrl = await uploadToCloudinary(imageBuffer);
    }

    const newStudent = new Student({ 
        ...studentData, 
        startDate: start,
        endDate: end,
        profileImage: profileImageUrl 
    });
    
    await newStudent.save();

    try {
        await createPayment({
            studentId: newStudent._id,
            months: 1,
            monthlyCharge: parseInt(monthlyCharge) || 1500
        });
    } catch (payErr) {
        console.error("Payment record creation failed (non-critical):", payErr.message);
    }

    return newStudent;
};

export const getAllStudents = async (query = {}) => {
    // Auto-expire students whose end date has passed
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Student.updateMany(
        { endDate: { $lt: today }, status: "active" },
        { status: "expired" }
    );

    return await Student.find(query).populate("seatId").sort({ createdAt: -1 });
};

export const getStudentById = async (id) => {
    const student = await Student.findById(id).populate("seatId");
    if (!student) throw new Error("Student not found");
    return student;
};

export const updateStudent = async (id, updateData) => {
    const student = await Student.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!student) throw new Error("Student not found");
    return student;
};

export const deleteStudent = async (id) => {
    const student = await Student.findByIdAndDelete(id);
    if (!student) throw new Error("Student not found");
    return { message: "Student removed successfully" };
};
