import { Seat } from "../models/seatModel.js";
import { Student } from "../models/studentModel.js";
import { timeToMinutes } from "../utils/timeUtils.js";

const isOverlapping = (slot1, slot2) => {
    const s1 = timeToMinutes(slot1.startTime);
    const e1 = timeToMinutes(slot1.endTime);
    const s2 = timeToMinutes(slot2.startTime);
    const e2 = timeToMinutes(slot2.endTime);

    return s1 < e2 && s2 < e1;
};

export const createSeat = async () => {
    const seatCount = await Seat.countDocuments();
    const seatNumber = `Seat ${seatCount + 1}`;
    
    const newSeat = new Seat({
        seatNumber,
        slots: []
    });

    return await newSeat.save();
};

export const getSeats = async () => {
    return await Seat.find().sort({ createdAt: 1 });
};

export const updateSeat = async (id, seatNumber) => {
    const seat = await Seat.findById(id);
    if (!seat) throw new Error("Seat not found");

    seat.seatNumber = seatNumber;
    return await seat.save();
};

export const deleteSeat = async (id) => {
    const assignedStudent = await Student.findOne({ seatId: id });
    if (assignedStudent) {
        throw new Error(`Cannot delete seat: student "${assignedStudent.name}" is currently assigned to it`);
    }
    const seat = await Seat.findByIdAndDelete(id);
    if (!seat) throw new Error("Seat not found");
    return seat;
};

export const addSlot = async (seatId, slotData) => {
    const seat = await Seat.findById(seatId);
    if (!seat) throw new Error("Seat not found");

    const slotsOnThisDay = seat.slots.filter(s => s.day === slotData.day);
    if (slotsOnThisDay.length >= 4) {
        throw new Error(`Maximum 4 slots allowed for ${slotData.day}`);
    }

    const startMin = timeToMinutes(slotData.startTime);
    const endMin = timeToMinutes(slotData.endTime);

    if (endMin <= startMin) {
        throw new Error("End time must be greater than start time");
    }

    const hasOverlap = seat.slots
        .filter(s => s.day === slotData.day)
        .some(existingSlot => isOverlapping(existingSlot, slotData));
    
    if (hasOverlap) {
        throw new Error(`Slot time overlaps with an existing slot on ${slotData.day}`);
    }

    seat.slots.push(slotData);
    return await seat.save();
};

export const updateSlot = async (seatId, slotId, updateData) => {
    const seat = await Seat.findById(seatId);
    if (!seat) throw new Error("Seat not found");

    const slotIndex = seat.slots.findIndex(s => s._id.toString() === slotId);
    if (slotIndex === -1) throw new Error("Slot not found");

    const slot = seat.slots[slotIndex];

    if (updateData.day && updateData.day !== slot.day) {
        const slotsOnTargetDay = seat.slots.filter(s => s.day === updateData.day);
        if (slotsOnTargetDay.length >= 4) {
            throw new Error(`Maximum 4 slots allowed for ${updateData.day}`);
        }
    }

    if (updateData.startTime || updateData.endTime) {
        const newStartTime = updateData.startTime || slot.startTime;
        const newEndTime = updateData.endTime || slot.endTime;

        const startMin = timeToMinutes(newStartTime);
        const endMin = timeToMinutes(newEndTime);

        if (endMin <= startMin) {
            throw new Error("End time must be greater than start time");
        }

        const otherSlots = seat.slots.filter(s => s._id.toString() !== slotId && s.day === (updateData.day || slot.day));
        const hasOverlap = otherSlots.some(existingSlot => 
            isOverlapping(existingSlot, { startTime: newStartTime, endTime: newEndTime })
        );
        
        if (hasOverlap) {
            throw new Error(`Updated slot time overlaps with an existing slot on ${updateData.day || slot.day}`);
        }
    }

    if (updateData.studentId && slot.status === "occupied" && slot.studentId && slot.studentId.toString() !== updateData.studentId) {
        throw new Error("Slot is already occupied by another student");
    }

    if (updateData.startTime) slot.startTime = updateData.startTime;
    if (updateData.endTime) slot.endTime = updateData.endTime;
    if (updateData.status) slot.status = updateData.status;
    if (updateData.day) slot.day = updateData.day;
    if (updateData.studentId !== undefined) slot.studentId = updateData.studentId;

    return await seat.save();
};

export const deleteSlot = async (seatId, slotId) => {
    const seat = await Seat.findById(seatId);
    if (!seat) throw new Error("Seat not found");

    seat.slots = seat.slots.filter(s => s._id.toString() !== slotId);
    return await seat.save();
};
