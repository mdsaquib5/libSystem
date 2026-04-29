import * as studentService from "../services/studentService.js";

export const admitStudent = async (req, res) => {
    try {
        // req.file is provided by multer middleware (memory storage → buffer)
        const imageBuffer = req.file ? req.file.buffer : null;
        const student = await studentService.admitStudent(req.body, imageBuffer);
        res.status(201).json({ success: true, data: student, message: "Student admitted successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getAllStudents = async (req, res) => {
    try {
        const students = await studentService.getAllStudents();
        res.setHeader('Cache-Control', 'public, max-age=30');
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentById = async (req, res) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        res.status(200).json({ success: true, data: student, message: "Student updated successfully" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const result = await studentService.deleteStudent(req.params.id);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
