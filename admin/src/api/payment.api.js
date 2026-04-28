import API from "./axios";

export const getAllPayments = async () => {
    const response = await API.get("/payments");
    return response.data;
};

export const getPaymentsByStudent = async (studentId) => {
    const response = await API.get(`/payments/student/${studentId}`);
    return response.data;
};

export const updatePaymentStatus = async (id, status) => {
    const response = await API.patch(`/payments/${id}/status`, { status });
    return response.data;
};
