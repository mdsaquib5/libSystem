import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", attendanceController.getTodayAttendance);
router.patch("/:id", attendanceController.updateAttendance);

export default router;
