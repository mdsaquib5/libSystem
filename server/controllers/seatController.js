import * as seatService from "../services/seatService.js";

export const createSeat = async (req, res) => {
    try {
        const seat = await seatService.createSeat();
        res.status(201).json({ success: true, message: "Seat created successfully", data: seat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getSeats = async (req, res) => {
    try {
        const seats = await seatService.getSeats();
        res.status(200).json({ success: true, data: seats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateSeat = async (req, res) => {
    try {
        const { seatNumber } = req.body;
        const seat = await seatService.updateSeat(req.params.id, seatNumber);
        res.status(200).json({ success: true, message: "Seat updated successfully", data: seat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSeat = async (req, res) => {
    try {
        await seatService.deleteSeat(req.params.id);
        res.status(200).json({ success: true, message: "Seat deleted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addSlot = async (req, res) => {
    try {
        const seat = await seatService.addSlot(req.params.id, req.body);
        res.status(201).json({ success: true, message: "Slot added successfully", data: seat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateSlot = async (req, res) => {
    try {
        const { id, slotId } = req.params;
        const seat = await seatService.updateSlot(id, slotId, req.body);
        res.status(200).json({ success: true, message: "Slot updated successfully", data: seat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteSlot = async (req, res) => {
    try {
        const { id, slotId } = req.params;
        const seat = await seatService.deleteSlot(id, slotId);
        res.status(200).json({ success: true, message: "Slot deleted successfully", data: seat });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
