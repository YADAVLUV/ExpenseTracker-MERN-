import axios from "axios";
import nodemailer from "nodemailer";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.EMAIL;

export async function sendEmail({ to, subject, html }) {
  if (!to || !subject || !html) {
    throw new Error("Missing required email fields (to, subject, html)");
  }

  // Prefer HTTPS API in production (often SMTP egress is blocked on hosts like Vercel)
  if (RESEND_API_KEY) {
    const apiUrl = "https://api.resend.com/emails";
    const from = EMAIL_FROM;
    if (!from) {
      throw new Error("EMAIL_FROM is required when using RESEND_API_KEY");
    }
    const payload = { from, to, subject, html }; // 'to' can be string or array
    const headers = {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    };
    const { data } = await axios.post(apiUrl, payload, { headers, timeout: 15000 });
    return data;
  }

  // Fallback to Nodemailer SMTP (best for local dev)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.verify();

  const info = await transporter.sendMail({ from: EMAIL_FROM || process.env.EMAIL, to, subject, html });
  return { id: info.messageId, response: info.response };
}


