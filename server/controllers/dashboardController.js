import { Student } from "../models/studentModel.js";
import { Seat } from "../models/seatModel.js";
import { Attendance } from "../models/attendanceModel.js";
import { getTodayDateString } from "../utils/timeUtils.js";

export const getDashboardStats = async (req, res) => {
    try {
        const today = getTodayDateString();
        
        // Run all counts in parallel at the database level for maximum speed
        const [totalStudents, presentCount, absentCount, occupiedSeatsCount, totalSeats] = await Promise.all([
            Student.countDocuments(),
            Attendance.countDocuments({ date: today, status: 'present' }),
            Attendance.countDocuments({ date: today, status: 'absent' }),
            Seat.countDocuments({ "slots.status": "occupied" }),
            Seat.countDocuments()
        ]);

        const freeSeats = totalSeats - occupiedSeatsCount;

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                presentStudents: presentCount,
                absentStudents: absentCount,
                freeSeats: freeSeats > 0 ? freeSeats : 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
