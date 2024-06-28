import { Request, Response } from 'express';
import User from '../models/userModel';
import { generateToken } from '../utils/generateToken';
import { hashPassword, comparePassword } from '../services/passwordService';
import { validateEmail, validatePassword } from '../utils/validators';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        const user = new User({ username, email, password: hashedPassword });

        await user.save();

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long, contain at least one letter, one number, and one special character' });
        }

        const user = await User.findOne({ email });

        if (user && (await comparePassword(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

