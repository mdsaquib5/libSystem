import jwt from "jsonwebtoken";
import { Admin } from "../models/adminModel.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Only fetch admin from DB if we actually need the admin object downstream.
        // For most auth checks, the decoded token payload is sufficient.
        // We use lean() to skip Mongoose document hydration overhead.
        req.admin = await Admin.findById(decoded.id).select("-password").lean();

        if (!req.admin) {
            return res.status(401).json({ success: false, message: "Not authorized, invalid token" });
        }

        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
