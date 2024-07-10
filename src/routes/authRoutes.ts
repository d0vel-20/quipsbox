import { Router } from 'express';
import { register, verifyOTP, login, resendOTP } from '../controllers/authControllers';

const router = Router();



router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);




export default router;

