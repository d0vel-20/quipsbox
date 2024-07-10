"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResetPasswordEmail = exports.sendOTPEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const HOST = process.env.EMAIL_HOST;
const PORT = process.env.EMAIL_PORT;
const USER = process.env.EMAIL_USER;
const PASS = process.env.EMAIL_PASS;
// mail request
const sendOTPEmail = (email, otp) => {
    return new Promise((resolve, reject) => {
        // email configuration 
        const transporter = nodemailer_1.default.createTransport({
            host: HOST,
            port: PORT,
            auth: {
                user: USER,
                pass: PASS
            }
        });
        const mailOptions = {
            from: USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It expires in 15 minutes.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            }
            else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
};
exports.sendOTPEmail = sendOTPEmail;
const sendResetPasswordEmail = (email, resetToken) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer_1.default.createTransport({
            host: HOST,
            port: PORT,
            auth: {
                user: USER,
                pass: PASS,
            },
        });
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}. This link expires in 15 minutes.`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                reject(error);
            }
            else {
                console.log('Email sent:', info.response);
                resolve(true);
            }
        });
    });
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
//# sourceMappingURL=emailService.js.map