import mongoose from "mongoose";

const slotSchema = new mongoose.Schema({
    startTime: {
        hour: { type: String, required: true },
        minute: { type: String, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true }
    },
    endTime: {
        hour: { type: String, required: true },
        minute: { type: String, required: true },
        period: { type: String, enum: ["AM", "PM"], required: true }
    }
}, { timestamps: true });

const seatSchema = new mongoose.Schema({
    seatNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slots: [slotSchema]
}, { timestamps: true });

seatSchema.index({ "slots.startTime.hour": 1 });
seatSchema.index({ "slots.startTime.period": 1 });

export const Seat = mongoose.model("Seat", seatSchema);
