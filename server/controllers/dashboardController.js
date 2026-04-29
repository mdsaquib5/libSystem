import { Student } from "../models/studentModel.js";
import { Seat } from "../models/seatModel.js";
import { Attendance } from "../models/attendanceModel.js";
import { getTodayDateString } from "../utils/timeUtils.js";

export const getDashboardStats = async (req, res) => {
    try {
        const today = getTodayDateString();
        
        // Run all queries in parallel for maximum speed
        const [students, seats, attendance] = await Promise.all([
            Student.countDocuments(),
            Seat.find(),
            Attendance.find({ date: today })
        ]);

        const presentCount = attendance.filter(r => r.status === 'present').length;
        const absentCount = attendance.filter(r => r.status === 'absent').length;
        
        const totalSeats = seats.length;
        const occupiedSeatsCount = seats.filter(seat => 
            seat.slots.some(slot => slot.status === 'occupied')
        ).length;

        const freeSeats = totalSeats - occupiedSeatsCount;

        // Set Cache-Control header for 30 seconds to prevent constant 304 checks
        res.setHeader('Cache-Control', 'public, max-age=30');

        res.status(200).json({
            success: true,
            data: {
                totalStudents: students,
                presentStudents: presentCount,
                absentStudents: absentCount,
                freeSeats: freeSeats > 0 ? freeSeats : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
