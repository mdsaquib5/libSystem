import express from "express";
import * as seatController from "../controllers/seatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Apply authMiddleware to all routes (Admin only)
router.use(authMiddleware);

// Seat routes
router.get("/", seatController.getSeats);
router.post("/", seatController.createSeat);
router.patch("/:id", seatController.updateSeat);
router.delete("/:id", seatController.deleteSeat);

// Slot routes
router.post("/:id/slots", seatController.addSlot);
router.patch("/:id/slots/:slotId", seatController.updateSlot);
router.delete("/:id/slots/:slotId", seatController.deleteSlot);

export default router;
