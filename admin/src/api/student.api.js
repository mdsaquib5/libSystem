import API from "./axios";

export const admitStudent = async (formData) => {
    const response = await API.post("/students/admission", formData);
    return response.data;
};

export const getStudents = async () => {
    const response = await API.get("/students");
    return response.data;
};

export const getStudentById = async (id) => {
    const response = await API.get(`/students/${id}`);
    return response.data;
};

export const updateStudent = async (id, updateData) => {
    const response = await API.patch(`/students/${id}`, updateData);
    return response.data;
};

export const deleteStudent = async (id) => {
    const response = await API.delete(`/students/${id}`);
    return response.data;
};
