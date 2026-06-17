// import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// const resend = new Resend(process.env.RESEND_API_KEY);
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html };
  // return await resend.emails.send(msg);
  return await transporter.sendMail(msg);
};
