import { Attendance } from "../models/attendanceModel.js";
import { Student } from "../models/studentModel.js";
import { isTimeInSlot, getTodayDateString } from "../utils/timeUtils.js";

export const getTodayAttendance = async () => {
    const today = getTodayDateString();
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Fetch students and attendance in parallel
    const [students, existingAttendance] = await Promise.all([
        Student.find({
            startDate: { $lte: todayEnd },
            endDate: { $gte: todayStart },
            status: "active"
        }).populate("seatId"),
        Attendance.find({ date: today })
    ]);

    const attendanceMap = new Map(existingAttendance.map(a => [a.studentId.toString(), a]));

    return students.map(student => {
        const studentId = student._id.toString();
        const record = attendanceMap.get(studentId);

        if (record) {
            return {
                ...record.toObject(),
                student: student.toObject()
            };
        }

        // Virtual record for students without a mark yet
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
            isManual: false,
            isVirtual: true, // Hint for the frontend/controller
            student: student.toObject()
        };
    });
};

export const updateAttendance = async (id, status, studentId) => {
    const today = getTodayDateString();

    // If id is provided, update existing. If not, upsert using studentId and date.
    let record;
    if (id && id.length === 24) { // Valid MongoDB ID
        record = await Attendance.findByIdAndUpdate(
            id,
            { status, isManual: true },
            { returnDocument: 'after', upsert: true }
        ).populate("studentId");
    } else {
        // Find student to get seat/slot info
        const student = await Student.findById(studentId);
        if (!student) throw new Error("Student not found");

        record = await Attendance.findOneAndUpdate(
            { studentId, date: today },
            {
                status,
                isManual: true,
                seatId: student.seatId,
                slotId: student.slotId,
                date: today,
                studentId
            },
            { returnDocument: 'after', upsert: true, new: true }
        ).populate("studentId");
    }

    if (!record) throw new Error("Attendance record not found or could not be created");
    return record;
};
