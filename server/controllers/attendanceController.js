import * as attendanceService from "../services/attendanceService.js";

export const getTodayAttendance = async (req, res) => {
    try {
        const attendance = await attendanceService.getTodayAttendance();
        res.status(200).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateAttendance = async (req, res) => {
    try {
        const { status, studentId } = req.body;
        const attendance = await attendanceService.updateAttendance(req.params.id, status, studentId);
        res.status(200).json({ success: true, data: attendance, message: "Attendance updated manually" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
