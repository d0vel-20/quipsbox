import { Router } from 'express';
import { register, verifyOTP, login, resendOTP, forgotPassword, resetPassword} from '../controllers/authControllers';

const router = Router();



router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);




export default router;

