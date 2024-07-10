"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
router.post('/register', authControllers_1.register);
router.post('/verify-otp', authControllers_1.verifyOTP);
router.post('/login', authControllers_1.login);
router.post('/resend-otp', authControllers_1.resendOTP);
router.post('/forgot-password', authControllers_1.forgotPassword);
router.post('/reset-password', authControllers_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map