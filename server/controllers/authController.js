import bcrypt from "bcrypt";
import { Admin } from "../models/adminModel.js";
import { generateToken } from "../utils/token.js";

// @desc    Register a new admin
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ success: false, message: "Admin already exists" });
        }

        // Manual Hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        if (admin) {
            const token = generateToken(admin._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
            });

            return res.status(201).json({
                success: true,
                data: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid admin data" });
        }
    } catch (error) {
        console.error("Signup Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error during signup" });
    }
};

// @desc    Auth admin & get token
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }

        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Manual Password Comparison
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            const token = generateToken(admin._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 365 * 24 * 60 * 60 * 1000 // 1 year
            });

            return res.status(200).json({
                success: true,
                data: {
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email
                }
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error during login" });
    }
};

// @desc    Logout admin / clear cookie
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            expires: new Date(0)
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error during logout" });
    }
};

// @desc    Get admin profile
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin._id).select("-password");
        if (admin) {
            return res.status(200).json({ success: true, data: admin });
        } else {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }
    } catch (error) {
        console.error("GetMe Error:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
