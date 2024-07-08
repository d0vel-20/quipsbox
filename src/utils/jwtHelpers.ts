import jwt from 'jsonwebtoken';
import { token } from 'morgan';

export const generateToken = (userid: string): string => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET);
}