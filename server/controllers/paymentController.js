import * as paymentService from "../services/paymentService.js";

export const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPaymentsByStudent = async (req, res) => {
    try {
        const payments = await paymentService.getPaymentsByStudent(req.params.studentId);
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updatePaymentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const payment = await paymentService.updatePaymentStatus(req.params.id, status);
        res.status(200).json({ success: true, data: payment, message: "Payment status updated" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
