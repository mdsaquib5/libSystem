import api from './axios';

export const getSeats = async (params) => {
    const response = await api.get('/seats', { params });
    return response.data;
};

export const createSeat = async () => {
    const response = await api.post('/seats');
    return response.data;
};

export const updateSeat = async (id, seatNumber) => {
    const response = await api.patch(`/seats/${id}`, { seatNumber });
    return response.data;
};

export const deleteSeat = async (id) => {
    const response = await api.delete(`/seats/${id}`);
    return response.data;
};

export const addSlot = async (id, slotData) => {
    const response = await api.post(`/seats/${id}/slots`, slotData);
    return response.data;
};

export const updateSlot = async (id, slotId, slotData) => {
    const response = await api.patch(`/seats/${id}/slots/${slotId}`, slotData);
    return response.data;
};

export const deleteSlot = async (id, slotId) => {
    const response = await api.delete(`/seats/${id}/slots/${slotId}`);
    return response.data;
};
