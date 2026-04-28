import API from "./axios";

export const getTodayAttendance = async () => {
    const response = await API.get("/attendance");
    return response.data;
};

export const updateAttendance = async (id, status) => {
    const response = await API.patch(`/attendance/${id}`, { status });
    return response.data;
};
