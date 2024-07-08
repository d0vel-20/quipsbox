import { Router } from 'express';
import { register, verifyOTP, login } from '../controllers/authControllers';

const router = Router();

router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/login', login);

export default router;

