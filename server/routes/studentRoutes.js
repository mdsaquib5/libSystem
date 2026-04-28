import express from "express";
import * as studentController from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Admission Route — multer parses the image file from multipart/form-data
router.post("/admission", upload.single("profileImage"), studentController.admitStudent);

// Student Management Routes
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.patch("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

export default router;