import API from "./axios";

export const getTodayAttendance = async () => {
    const response = await API.get("/attendance");
    return response.data;
};

export const updateAttendance = async (id, status, studentId) => {
    const response = await API.patch(`/attendance/${id}`, { status, studentId });
    return response.data;
};
