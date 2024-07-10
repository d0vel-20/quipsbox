import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const HOST: any = process.env.EMAIL_HOST
const PORT: any = process.env.EMAIL_PORT
const USER: any = process.env.EMAIL_USER
const PASS: any = process.env.EMAIL_PASS

// mail request
export const sendOTPEmail = (email: string, otp: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
      // email configuration 
      const transporter = nodemailer.createTransport({
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

      transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.error('Error sending email:', error);
          reject(error);
      } else {
          console.log('Email sent:', info.response);
          resolve(true);
      }
      });
  });

}

export const sendResetPasswordEmail = (email: string, resetCode: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        host: HOST,
        port: PORT,
        auth: {
          user: USER,
          pass: PASS,
        },
      });
  
      const mailOptions = {
        from: USER,
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Your reset code is ${resetCode}. This code expires in 15 minutes.`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.error('Error sending email:', error);
          reject(error);
        } else {
          console.log('Email sent:', info.response);
          resolve(true);
        }
      });
    });
  };

