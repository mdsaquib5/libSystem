import { Payment } from "../models/paymentModel.js";

export const createPayment = async ({ studentId, months, monthlyCharge = 1500 }) => {
    const totalAmount = months * monthlyCharge;
    return await Payment.create({ studentId, months, monthlyCharge, totalAmount });
};

export const getAllPayments = async () => {
    return await Payment.find()
        .populate("studentId", "name phone email")
        .sort({ createdAt: -1 });
};

export const getPaymentsByStudent = async (studentId) => {
    return await Payment.find({ studentId }).sort({ createdAt: -1 });
};

export const updatePaymentStatus = async (id, status) => {
    const payment = await Payment.findByIdAndUpdate(
        id,
        { status },
        { returnDocument: "after" }
    ).populate("studentId", "name phone");
    if (!payment) throw new Error("Payment record not found");
    return payment;
};
