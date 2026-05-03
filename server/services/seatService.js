import { Seat } from "../models/seatModel.js";
import { Student } from "../models/studentModel.js";
import { timeToMinutes } from "../utils/timeUtils.js";
import { checkOverlap } from "../utils/dateUtils.js";

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

export const getSeats = async (startDate, endDate) => {
    const seats = await Seat.find().sort({ createdAt: 1 });
    
    // Default to today if no date range provided
    const today = new Date().toISOString().split('T')[0];
    const start = new Date(startDate || today);
    const end = new Date(endDate || today);

    // Fetch all active bookings that might overlap
    const activeBookings = await Student.find({ status: "active" });

    return seats.map(seat => {
        const seatObj = seat.toObject();
        seatObj.slots = seatObj.slots.map(slot => {
            const booking = activeBookings.find(b => 
                b.seatId.toString() === seat._id.toString() &&
                b.slotId.toString() === slot._id.toString() &&
                checkOverlap(b.startDate, b.endDate, start, end)
            );
            return { 
                ...slot, 
                status: booking ? "occupied" : "available",
                bookingEndDate: booking ? booking.endDate : null
            };
        });
        return seatObj;
    });
};

export const updateSeat = async (id, seatNumber) => {
    const seat = await Seat.findById(id);
    if (!seat) throw new Error("Seat not found");

    seat.seatNumber = seatNumber;
    return await seat.save();
};

export const deleteSeat = async (id) => {
    const assignedStudent = await Student.findOne({ seatId: id, status: "active" });
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

    if (seat.slots.length >= 8) { // General limit instead of per-day
        throw new Error(`Maximum 8 slots allowed per seat`);
    }

    const startMin = timeToMinutes(slotData.startTime);
    const endMin = timeToMinutes(slotData.endTime);

    if (endMin <= startMin) {
        throw new Error("End time must be greater than start time");
    }

    const hasOverlap = seat.slots.some(existingSlot => isOverlapping(existingSlot, slotData));
    
    if (hasOverlap) {
        throw new Error(`Slot time overlaps with an existing slot`);
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

    if (updateData.startTime || updateData.endTime) {
        const newStartTime = updateData.startTime || slot.startTime;
        const newEndTime = updateData.endTime || slot.endTime;

        const startMin = timeToMinutes(newStartTime);
        const endMin = timeToMinutes(newEndTime);

        if (endMin <= startMin) {
            throw new Error("End time must be greater than start time");
        }

        const otherSlots = seat.slots.filter(s => s._id.toString() !== slotId);
        const hasOverlap = otherSlots.some(existingSlot => 
            isOverlapping(existingSlot, { startTime: newStartTime, endTime: newEndTime })
        );
        
        if (hasOverlap) {
            throw new Error(`Updated slot time overlaps with an existing slot`);
        }
    }

    if (updateData.startTime) slot.startTime = updateData.startTime;
    if (updateData.endTime) slot.endTime = updateData.endTime;

    return await seat.save();
};

export const deleteSlot = async (seatId, slotId) => {
    const seat = await Seat.findById(seatId);
    if (!seat) throw new Error("Seat not found");

    seat.slots = seat.slots.filter(s => s._id.toString() !== slotId);
    return await seat.save();
};
