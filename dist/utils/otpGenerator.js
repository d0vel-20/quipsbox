"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSixDigitCode = exports.generateOTP = void 0;
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};
exports.generateOTP = generateOTP;
const generateSixDigitCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateSixDigitCode = generateSixDigitCode;
//# sourceMappingURL=otpGenerator.js.map