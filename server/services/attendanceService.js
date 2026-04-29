import { Attendance } from "../models/attendanceModel.js";
import { Student } from "../models/studentModel.js";
import { Seat } from "../models/seatModel.js";
import { isTimeInSlot, getTodayDateString } from "../utils/timeUtils.js";

export const getTodayAttendance = async () => {
    const today = getTodayDateString();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const students = await Student.find().populate("seatId");
    const existingAttendance = await Attendance.find({ date: today });
    const attendanceMap = new Map(existingAttendance.map(a => [a.studentId.toString(), a]));

    const missingStudents = students.filter(s => !attendanceMap.has(s._id.toString()));

    if (missingStudents.length > 0) {
        const newRecords = missingStudents.map(student => {
            const seat = student.seatId;
            const slot = seat?.slots?.id(student.slotId);
            
            let status = "absent";
            if (slot) {
                const inSlot = isTimeInSlot(slot.startTime, slot.endTime, currentMinutes);
                status = inSlot ? "present" : "absent";
            }

            return {
                studentId: student._id,
                seatId: student.seatId,
                slotId: student.slotId,
                date: today,
                status,
                isManual: false
            };
        });

        const createdRecords = await Attendance.insertMany(newRecords);
        createdRecords.forEach(r => attendanceMap.set(r.studentId.toString(), r));
    }

    return students.map(student => ({
        ...attendanceMap.get(student._id.toString()).toObject(),
        student: student.toObject()
    }));
};

export const updateAttendance = async (id, status) => {
    const record = await Attendance.findByIdAndUpdate(
        id,
        { status, isManual: true },
        { returnDocument: 'after' }
    ).populate("studentId");

    if (!record) throw new Error("Attendance record not found");
    return record;
};
