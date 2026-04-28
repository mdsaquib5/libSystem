import { Attendance } from "../models/attendanceModel.js";
import { Student } from "../models/studentModel.js";
import { isTimeInSlot, getTodayDateString } from "../utils/timeUtils.js";

export const getTodayAttendance = async () => {
    const today = getTodayDateString();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Fetch students and existing attendance records in parallel
    const [students, existingAttendance] = await Promise.all([
        Student.find().populate("seatId").lean(),
        Attendance.find({ date: today }).lean()
    ]);

    const attendanceMap = new Map(existingAttendance.map(a => [a.studentId.toString(), a]));

    const newRecords = [];
    const results = [];

    for (const student of students) {
        const existing = attendanceMap.get(student._id.toString());

        if (existing) {
            results.push({ ...existing, student });
            continue;
        }

        // Determine status without hitting the DB
        const seat = student.seatId;
        const slot = seat?.slots?.find(s => s._id.toString() === student.slotId?.toString());

        let status = "absent";
        if (slot) {
            status = isTimeInSlot(slot.startTime, slot.endTime, currentMinutes) ? "present" : "absent";
        }

        const newRecord = {
            studentId: student._id,
            seatId: student.seatId?._id || student.seatId,
            slotId: student.slotId,
            date: today,
            status,
            isManual: false
        };

        newRecords.push(newRecord);
        results.push({ ...newRecord, student });
    }

    // Bulk insert all new records in a single DB operation instead of N individual upserts
    if (newRecords.length > 0) {
        await Attendance.insertMany(
            newRecords.map(r => ({ ...r })),
            { ordered: false }
        ).catch(() => {
            // Ignore duplicate key errors on race conditions
        });
    }

    return results;
};

export const updateAttendance = async (id, status) => {
    const record = await Attendance.findByIdAndUpdate(
        id,
        { status, isManual: true },
        { returnDocument: "after" }
    ).populate("studentId").lean();

    if (!record) throw new Error("Attendance record not found");
    return record;
};
