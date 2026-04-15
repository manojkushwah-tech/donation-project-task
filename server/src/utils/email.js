import transporter from "../config/nodemailer.config.js";
import dotenv from "dotenv";

dotenv.config();
// ================= OTP Email Template =================
const otpTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
    .header { background-color: #007bff; color: #ffffff; padding: 10px; text-align: center; }
    .content { padding: 20px; }
    .otp { font-size: 24px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0; }
    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>Thank you for registering with us. Please use the following OTP to verify your email address:</p>
      <div class="otp">${data.otp}</div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Temple Donation System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// ================= Reset Password Email Template =================
const resetPasswordTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
    .header { background-color: #dc3545; color: #ffffff; padding: 10px; text-align: center; }
    .content { padding: 20px; }
    .button { display: inline-block; background-color: #dc3545; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; color: #666666; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <div class="content">
      <p>Dear ${data.name},</p>
      <p>You have requested to reset your password. Click the button below to reset it:</p>
      <a href="${data.resetUrl}" class="button">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Temple Donation System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// ================= Send Email Function =================
export const sendEmail = async ({ to, subject, template, data }) => {
  let html;

  switch (template) {
    case "otp":
      html = otpTemplate(data);
      break;
    case "resetPassword":
      html = resetPasswordTemplate(data);
      break;
    default:
      throw new Error("Invalid email template");
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
};