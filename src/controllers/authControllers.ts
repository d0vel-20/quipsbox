import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/userModel';
import { generateOTP, generateSixDigitCode } from '../utils/otpGenerator';
import { sendOTPEmail, sendResetPasswordEmail} from '../services/emailService';
import { comparePasswords } from '../utils/passwordUtils';



export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(404).json({ data: 'email address already exists', msg: "Failure" });
    }

    const userName = await User.findOne({ username });
    if (userName) {
      return res.status(404).json({ data: 'username already exists', msg: "Failure" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP expires in 15 minutes

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newUser.save();

    await sendOTPEmail(email, otp);

    res.status(201).json({ data: 'User registered. OTP sent to email.', msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`)
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.status(200).json({ data: { user, message: 'OTP verified. User is now verified.', token}, msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`)
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ data: 'User not found', msg: "Failure" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ data: 'User not verified', msg: "Failure" });
    }

    const isMatch = await comparePasswords(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ data: 'Invalid credentials', msg: "Failure" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.status(200).json({ data: { user, message: 'Logged in successfully', token }, msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`)
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};



export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await user.save();

    await sendOTPEmail(email, `Your OTP code is ${otp}`);

    res.json({ msg: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
};


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ data: 'User not found', msg: "Failure" });
    }

    const resetCode = generateSixDigitCode();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    await sendResetPasswordEmail(email, resetCode);

    res.status(200).json({ data: 'Reset code sent to email.', msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};

export const verifyResetCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resetCode } = req.body;

    const user = await User.findOne({ resetCode, resetCodeExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ data: 'Invalid or expired reset code', msg: "Failure" });
    }

    res.status(200).json({ data: 'Reset code verified', email: user.email, msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email, resetCode: { $exists: true }, resetCodeExpires: { $gt: new Date() } });
    if (!user) {
      return res.status(400).json({ data: 'Invalid or expired reset code', msg: "Failure" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.status(200).json({ data: 'Password reset successfully', msg: "Success" });
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ data: 'Internal server error', msg: "Failure" });
  }
};



