"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.resetPassword = exports.resendOTP = exports.login = exports.verifyOTP = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const otpGenerator_1 = require("../utils/otpGenerator");
const emailService_1 = require("../services/emailService");
const passwordUtils_1 = require("../utils/passwordUtils");
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userEmail = await userModel_1.default.findOne({ email });
        if (userEmail) {
            return res.status(404).json({ data: 'email address already exists', msg: "Failure" });
        }
        const userName = await userModel_1.default.findOne({ username });
        if (userName) {
            return res.status(404).json({ data: 'username already exists', msg: "Failure" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const otp = (0, otpGenerator_1.generateOTP)();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes
        const newUser = new userModel_1.default({
            username,
            email,
            password: hashedPassword,
            otp,
            otpExpires,
        });
        await newUser.save();
        await (0, emailService_1.sendOTPEmail)(email, otp);
        res.status(201).json({ data: 'User registered. OTP sent to email.', msg: "Success" });
    }
    catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ data: 'Internal server error', msg: "Failure" });
    }
};
exports.register = register;
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ data: 'User not found', msg: "Failure" });
        }
        if (user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ data: 'Invalid or expired OTP', msg: "Failure" });
        }
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(200).json({ data: { user, message: 'OTP verified. User is now verified.', token }, msg: "Success" });
    }
    catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ data: 'Internal server error', msg: "Failure" });
    }
};
exports.verifyOTP = verifyOTP;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ data: 'User not found', msg: "Failure" });
        }
        if (!user.isVerified) {
            return res.status(400).json({ data: 'User not verified', msg: "Failure" });
        }
        const isMatch = await (0, passwordUtils_1.comparePasswords)(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ data: 'Invalid credentials', msg: "Failure" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '24h',
        });
        res.status(200).json({ data: { user, message: 'Logged in successfully', token }, msg: "Success" });
    }
    catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ data: 'Internal server error', msg: "Failure" });
    }
};
exports.login = login;
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ msg: 'User not found' });
        const otp = (0, otpGenerator_1.generateOTP)();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        await user.save();
        await (0, emailService_1.sendOTPEmail)(email, `Your OTP code is ${otp}`);
        res.json({ msg: 'OTP sent successfully' });
    }
    catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
};
exports.resendOTP = resendOTP;
const resetPassword = async (req, res, next) => {
    try {
        const { resetToken, newPassword } = req.body;
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(resetToken, process.env.JWT_SECRET);
        }
        catch (error) {
            return res.status(400).json({ data: 'Invalid or expired token', msg: "Failure" });
        }
        const user = await userModel_1.default.findById(decoded.id);
        if (!user) {
            return res.status(400).json({ data: 'User not found', msg: "Failure" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ data: 'Password reset successfully', msg: "Success" });
    }
    catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ data: 'Internal server error', msg: "Failure" });
    }
};
exports.resetPassword = resetPassword;
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ data: 'User not found', msg: "Failure" });
        }
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        await (0, emailService_1.sendResetPasswordEmail)(email, resetToken);
        res.status(200).json({ data: 'Reset token sent to email.', msg: "Success" });
    }
    catch (error) {
        console.log(`error: ${error.message}`);
        res.status(500).json({ data: 'Internal server error', msg: "Failure" });
    }
};
exports.forgotPassword = forgotPassword;
//# sourceMappingURL=authControllers.js.map