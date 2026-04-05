import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined
});

export async function sendEmail({ to, subject, html }) {
  return transporter.sendMail({ from: env.smtp.from, to, subject, html });
}
