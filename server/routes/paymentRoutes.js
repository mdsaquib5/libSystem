import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", paymentController.getAllPayments);
router.get("/student/:studentId", paymentController.getPaymentsByStudent);
router.patch("/:id/status", paymentController.updatePaymentStatus);

export default router;
