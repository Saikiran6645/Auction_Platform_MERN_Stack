import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    port: process.env.SMTP_PORT,
    secure: true,
    pool: true,
    maxConnections: 5,
    maxMessages: 10,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  const options = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: subject,
    text: message,
  };
  await transporter.sendMail(options);
};
