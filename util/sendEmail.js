import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, from, subject, text, html }) => {
  const msg = { to, from, subject, text, html };
  return await resend.emails.send(msg);
};
