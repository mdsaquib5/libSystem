import { Student } from "../models/studentModel.js";
import { Seat } from "../models/seatModel.js";
import { Attendance } from "../models/attendanceModel.js";
import { getTodayDateString } from "../utils/timeUtils.js";

export const getDashboardStats = async (req, res) => {
    try {
        const todayStr = getTodayDateString();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const [activeStudents, presentCount, absentCount, allSeats] = await Promise.all([
            Student.find({ 
                startDate: { $lte: todayEnd }, 
                endDate: { $gte: todayStart },
                status: "active"
            }),
            Attendance.countDocuments({ date: todayStr, status: 'present' }),
            Attendance.countDocuments({ date: todayStr, status: 'absent' }),
            Seat.find().sort({ createdAt: 1 })
        ]);

        const totalSeats = allSeats.length;
        const totalSlots = allSeats.reduce((sum, seat) => sum + seat.slots.length, 0);
        
        const seatAvailability = allSeats.map(seat => {
            const occupiedInSeat = activeStudents.filter(s => s.seatId.toString() === seat._id.toString());
            const availableSlotsCount = seat.slots.filter(slot => {
                const isOccupied = occupiedInSeat.some(booking => 
                    booking.slotId.toString() === slot._id.toString()
                );
                return !isOccupied;
            }).length;

            return {
                seatId: seat._id,
                seatNumber: seat.seatNumber,
                totalSlots: seat.slots.length,
                availableSlots: availableSlotsCount
            };
        });

        const totalAvailableSlots = seatAvailability.reduce((sum, s) => sum + s.availableSlots, 0);
        const totalOccupiedSlots = totalSlots - totalAvailableSlots;

        res.status(200).json({
            success: true,
            data: {
                totalStudents: activeStudents.length,
                presentStudents: presentCount,
                absentStudents: absentCount,
                totalSeats,
                totalSlots,
                totalAvailableSlots,
                totalOccupiedSlots,
                seatAvailability
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
