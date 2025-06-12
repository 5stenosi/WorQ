import nodemailer from "nodemailer";

export async function sendResetEmail(email: string, resetUrl: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // false for TLS (Google uses STARTTLS), true for SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `"WorQ Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
  });
}
