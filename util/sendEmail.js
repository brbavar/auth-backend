import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, from, subject, html }) => {
  const msg = { to, from, subject, html };
  return await resend.emails.send(msg);
};
