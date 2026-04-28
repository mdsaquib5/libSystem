import { Student } from "../models/studentModel.js";
import { Seat } from "../models/seatModel.js";
import mongoose from "mongoose";
import cloudinary from "../configs/cloudinary.js";
import { createPayment } from "./paymentService.js";

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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { seatId, slotId, months = 1, monthlyCharge = 1500 } = studentData;

        const seat = await Seat.findById(seatId).session(session);
        if (!seat) throw new Error("Seat not found");

        const slot = seat.slots.id(slotId);
        if (!slot) throw new Error("Slot not found");

        if (slot.status === "occupied") {
            throw new Error("This slot is already occupied by another student");
        }

        let profileImageUrl = null;
        if (imageBuffer) {
            profileImageUrl = await uploadToCloudinary(imageBuffer);
        }

        const newStudent = new Student({ ...studentData, profileImage: profileImageUrl });
        await newStudent.save({ session });

        slot.status = "occupied";
        slot.studentId = newStudent._id;
        await seat.save({ session });

        await session.commitTransaction();

        try {
            await createPayment({
                studentId: newStudent._id,
                months: parseInt(months) || 1,
                monthlyCharge: parseInt(monthlyCharge) || 1500
            });
        } catch (payErr) {
            console.error("Payment record creation failed (non-critical):", payErr.message);
        }

        return newStudent;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getAllStudents = async (query = {}) => {
    return await Student.find(query).populate("seatId").sort({ createdAt: -1 }).lean();
};

export const getStudentById = async (id) => {
    const student = await Student.findById(id).populate("seatId").lean();
    if (!student) throw new Error("Student not found");
    return student;
};

export const updateStudent = async (id, updateData) => {
    const student = await Student.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
    if (!student) throw new Error("Student not found");
    return student;
};

export const deleteStudent = async (id) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const student = await Student.findById(id).session(session);
        if (!student) throw new Error("Student not found");

        const seat = await Seat.findById(student.seatId).session(session);
        if (seat) {
            const slot = seat.slots.id(student.slotId);
            if (slot) {
                slot.status = "available";
                slot.studentId = null;
                await seat.save({ session });
            }
        }

        await Student.findByIdAndDelete(id).session(session);

        await session.commitTransaction();
        return { message: "Student removed and slot freed successfully" };
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
